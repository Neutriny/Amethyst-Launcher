# Amethyst Launcher 性能优化指南

本文梳理 Amethyst Launcher（Tauri + Next.js + React + Chakra UI）当前的卡顿来源，并给出对应的优化方案（A+B 方案），重点覆盖资源搜索、页面切换、滚动与输入等高频场景。

## 1. 卡顿现状与根因

### 1.1 搜索/列表打开慢（最大瓶颈）
- 代码位置：`src-tauri/src/resource/helpers/translation/mod.rs:170` `apply_other_resource_enhancements_concurrently`
- 现状：每次调用 `fetchResourceListByName`（CurseForge/Modrinth）后，后端会对整页（最多 20 条）记录逐一执行外部翻译请求，再返回给前端。而 `should_translate_resource_description` 默认开启（zh-Hans + `resourceTranslation`），导致搜索/翻页需要等待多个网络翻译请求完成。
- 相关调用：
  - CurseForge：`src-tauri/src/resource/helpers/curseforge/mod.rs:144`
  - Modrinth：`src-tauri/src/resource/helpers/modrinth/mod.rs:83`
- 影响：页面打开、切换标签/来源、翻页都会明显“卡顿”。

### 1.2 版本清单每次重新请求
- 代码位置：`src-tauri/src/resource/helpers/version_manifest.rs:33` `get_game_version_manifest`
- 现状：每次进入资源搜索、创建实例、下载模组包等场景都会重请求版本清单；只写入缓存文件不回读，且无内存缓存。
- 影响：打开资源搜索页/弹窗时多次重复请求，增加延迟。

### 1.3 mod_db 启动同步加载
- 代码位置：`src-tauri/src/lib.rs:302` `initialize_mod_db(&app_handle).await`
- 现状：应用启动时同步加载 `mod_data.csv`（可能数千条），导致启动阶段出现卡顿。
- 相关：`src-tauri/src/resource/helpers/mod_db.rs:299`

### 1.4 搜索输入与重渲染
- 代码位置：`src/components/resource-downloader.tsx`
- 现状：搜索框每次按键都 `setState(searchQuery)`，导致整个组件（包括虚拟列表、过滤菜单）重渲染；`buildOptionItems` 未 memo，导致列表行重建。
- 影响：输入卡顿，尤其在列表较长或 WebView 渲染压力较大时。

### 1.5 全局 Provider 重渲染风暴
- 代码位置：
  - `src/contexts/config.tsx:184`
  - `src/contexts/global-data.tsx`
  - `src/contexts/task.tsx`
- 现状：Provider `value` 每次渲染创建新对象，`setTasks`、`setConfig` 等状态更新都会触发大量子组件重渲染。

### 1.6 图片加载与滚动
- 列表、轮播、热点模块等远程图片默认无懒加载，WebView 中滚动时容易卡顿。
- 相关：`src/components/resource-downloader.tsx`、`src/pages/discover/home.tsx` 等

### 1.7 任务进度事件
- 代码位置：`src/contexts/task.tsx`
- 现状：每个进度事件都会触发 `setTasks` + 复杂排序/计算，导致下载/启动期间 UI 频繁重绘。

---

## 2. 优化方案总览（A+B）

| 类别 | 编号 | 目标                       |   | 关键点                                            |
|------|------|----------------------------|:--|---------------------------------------------------|
| A    | A1   | 翻译异步化（后台事件回填） |   | 搜索先返回原结果；网络翻译完成后通过事件回填      |
| A    | A2   | 版本清单缓存               |   | 内存缓存 + 短 TTL，减少重复网络请求               |
| A    | A3   | mod_db 惰性初始化          |   | 启动阶段不再阻塞；首次需要时加载                  |
| B    | B1   | Provider value memo        |   | useMemo 全局 Provider，减少子组件重渲染           |
| B    | B2   | 搜索输入防抖 + 列表 memo   |   | 避免每按键重渲染；过滤切换加 debounce             |
| B    | B3   | 图片懒加载                 |   | Avatar/图片加 `loading="lazy"` `decoding="async"` |
| B    | B4   | 任务进度节流               |   | rAF 合并高频 `setTasks`，减少重渲染               |

---

## 3. A1 详细方案：翻译异步化（后台事件回填）

### 3.1 目标
- 搜索请求返回时只包含“可快速获取的增强信息”（mod_db 名称/ID 等）。
- 网络翻译完成后，通过事件 `resource:search-enhanced` 回填列表。

### 3.2 后端改造

1. **拆分增强逻辑**  
   新增本地增强函数（如 `apply_other_resource_local_enhancements`）仅读取 mod_db（内存），搜索阶段同步执行，确保中文重排序（`sort_localized_search_results`）可立即获得 `translatedName`。
   - CurseForge：`src-tauri/src/resource/helpers/curseforge/mod.rs:144` 替换为本地增强
   - Modrinth：`src-tauri/src/resource/helpers/modrinth/mod.rs:83`

2. **后台任务**  
   `fetch_resource_list_by_name` 命令返回后，克隆 `list` 并：
   - `tauri::async_runtime::spawn` 执行 `apply_other_resource_enhancements_concurrently`
   - 若有翻译/描述变化，发射事件：
     ```rust
     app.emit("resource:search-enhanced", EnhancedPayload {
       request_id, page, list,
     })?;
     ```
   - 仅在 `should_translate_resource_description` 为 true 时启动后台任务。

3. **增加 requestId**  
   `OtherResourceSearchQuery` 增加 `requestId: String`，由前端在搜索时传入，用于匹配/去重。
   - 模型：`src-tauri/src/resource/models.rs` 或对应 models 目录

4. **翻译条件**  
   `should_translate_resource_description` 保持不变（zh-Hans + 功能开关），避免在不支持的场景下浪费资源。

### 3.3 前端改造

1. **ResourceService 增强**
   - `fetchResourceListByName` 增加 `requestId` 参数。
   - 新增 `onSearchResultEnhanced(callback)` 监听事件。

2. **ResourceDownloader 状态回填**
   - 每次搜索生成 `requestIdRef`，并传入 `fetchResourceListByName`。
   - 监听事件，匹配 `requestId` 与 `page`，将 `list` 按页回填。
   - 逻辑：
     - 第 0 页直接替换。
     - 加载更多页时，将 `list` 覆盖到 `resourceList[page*pageSize ..]` 区间。
   - 当 `requestId` 不匹配时（用户已改过滤条件），丢弃事件。

3. **Discover/Home 说明**
   - `fetchHotModpacks` 不实现监听（默认不依赖翻译）。
   - 若需翻译，可复用同一事件机制。

### 3.4 验证指标
- 搜索/翻页首次返回时间由“数秒”降到“毫秒级”。
- 本地缓存命中时，翻译回填延迟也极低（仅内存操作）。
- 中文搜索相关性保持（`sort_localized_search_results` 依然有效）。

---

## 4. A2 详细方案：版本清单缓存

### 4.1 代码位置
- `src-tauri/src/resource/helpers/version_manifest.rs:33` `get_game_version_manifest`
- 当前只将 `ids` 写入缓存文件 `game_versions.txt`（`save_version_list_to_cache`），但不会回读。

### 4.2 方案
1. **内存缓存**：新增全局状态（如 `Mutex<Option<(Instant, Vec<GameClientResourceInfo>)>>`），TTL 约 10 分钟。
2. **命中策略**：未过期直接返回；过期则刷新并在后台更新。
3. **fallback**：刷新失败时允许回退到上次缓存（或缓存文件），避免版本列表为空。

### 4.3 收益
- 多个页面/弹窗共用缓存，打开资源搜索或实例创建时立即可用。

---

## 5. A3 详细方案：mod_db 惰性初始化

### 5.1 代码位置
- 启动入口：`src-tauri/src/lib.rs:302` `initialize_mod_db`
- 加载函数：`src-tauri/src/resource/helpers/mod_db.rs:299`

### 5.2 方案
1. 移除启动阶段的同步加载，改为“首次需要时加载”。
2. 提供 `ensure_mod_db_initialized(app)`：检查 `initialized` 标志，按需初始化（加锁、读取 CSV、构建映射）。
3. 调用点：`handle_localized_search_query`（`mod_db.rs:371`）与本地增强函数。

### 5.3 收益
- 启动更快，首次中文搜索/本地增强触发时再加载。

---

## 6. B1 详细方案：Provider value memo

### 6.1 代码位置
- `src/contexts/config.tsx:184`
- `src/contexts/global-data.tsx`
- `src/contexts/task.tsx`

### 6.2 方案
- 为每个 Provider 的 `value` 创建 `useMemo`，仅当依赖变化时更新。
- 对 `handleUpdateLauncherConfig`、`handleCheckLauncherUpdate` 等函数使用 `useCallback`。
- 对 `task` 中高频更新（`tasks`, `generalPercent`）拆分状态，避免全局 Context 触发。

### 6.3 收益
- 大幅减少子组件重渲染，提升页面切换、滚动、输入的流畅度。

---

## 7. B2 详细方案：搜索输入防抖 + 列表 memo

### 7.1 代码位置
- `src/components/resource-downloader.tsx`

### 7.2 方案
1. **输入防抖**：将 `searchQuery` 改为本地输入状态，仅在 Enter/点击搜索时同步到过滤状态（或使用 debounce）。
2. **列表 memo**：`buildOptionItems` 输出使用 `useMemo`，依赖 `list`、`showZhTrans`、`primaryColor` 等。
3. **过滤切换**：`selectedTag`、`sortBy`、`downloadSource`、`gameVersion` 变更时添加 ~250ms debounce 后再请求。

### 7.3 收益
- 输入框不再卡顿；过滤切换时减少重复请求；虚拟列表重绘更少。

---

## 8. B3 详细方案：图片懒加载

### 8.1 代码位置
- 列表与卡片：`src/components/resource-downloader.tsx`、`src/pages/discover/home.tsx`
- 轮播与图片组件：`src/components/...`、`src/pages/discover/home.tsx`

### 8.2 方案
- 为远程 `<img>` 增加 `loading="lazy"`、`decoding="async"`。
- 对 Chakra `Avatar` 检查是否支持 `loading`/`decoding`；必要时改用 `Image` 或自定义 img。
- 对轮播图与图片资源同样应用懒加载。

### 8.3 收益
- 滚动更顺，WebView 渲染开销下降。

---

## 9. B4 详细方案：任务进度节流

### 9.1 代码位置
- `src/contexts/task.tsx`

### 9.2 方案
- 进度事件累积后通过 `requestAnimationFrame` 合并再 `setTasks`，避免每个 chunk 事件都触发整棵任务树重渲染。
- 必要时拆分 `tasks` 与 `generalPercent` 的更新来源，减少高频更新的上下文影响。

### 9.3 收益
- 下载/启动期间 UI 更流畅。

---

## 10. 实施顺序建议

1. A1（翻译异步化）— 改善资源搜索体验最明显  
2. A2（版本清单缓存）— 页面切换、弹窗加载更快  
3. A3（mod_db 惰性初始化）— 启动更快  
4. B2（输入防抖 + 列表 memo）— 输入与滚动体验提升  
5. B1（Provider memo）— 全局渲染压力下降  
6. B3（图片懒加载）— 滚动更顺  
7. B4（任务进度节流）— 下载/启动期间体验

---

## 11. 验证与回归

- **类型/样式检查**：前端 `pnpm lint`、`npx tsc --noEmit`；后端 `cargo check`（必要时 `cargo clippy`）。
- **手动测试**：
  - 资源搜索（zh-Hans + `resourceTranslation`）首次响应时间
  - 版本列表多场景复用（创建实例、下载模组等）
  - 启动耗时
  - 下载/启动任务时 UI 卡顿情况
- **回归关注点**：
  - 中文搜索重排序是否正常（A1 拆分后本地增强仍保留）
  - 翻译缓存命中率与事件匹配正确性
  - Provider memo 是否引起功能/显示回归

---

> 文档代码引用随项目迭代可能偏移；如需定位，请在对应目录内使用搜索工具（如 `rg`、`grep`）复查关键函数名。