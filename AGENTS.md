# Amethyst Launcher

基于 Tauri v2 的 Minecraft 启动器（Rust 后端 + SolidJS 前端 + UnoCSS + Vite）。

## 环境要求

- **系统**：仅 Windows (x86_64)，暂不支持 macOS / Linux
- **Node.js**：>= 22
- **Rust**：最新稳定版（通过 `rustup update` 保持）
- **包管理器**：pnpm
- **WebView2**：Windows 已预装，若窗口无法启动请检查 Edge WebView2 Runtime

## 常用命令

```bash
pnpm install          # 安装前端依赖
pnpm tauri dev        # 启动 Vite 开发服务器 + Tauri 窗口
pnpm tauri build      # 生产构建（前端 build + Rust release 编译）
pnpm lint             # ESLint 检查 (src/)
pnpm lint:fix         # ESLint 自动修复
pnpm format           # Prettier 格式化
pnpm format:check     # Prettier 检查
pnpm check            # ESLint + Prettier 同时检查
```

> 首次运行 `pnpm tauri dev` 时会下载并编译 Rust 依赖，耗时较长，属正常现象。

## 项目结构

```
src/
  index.tsx          # 前端入口（SolidJS render）
  App.tsx            # 根组件
  App.css            # 根组件样式
  assets/            # 静态资源（logo.svg 等）
  vite-env.d.ts      # Vite 类型声明

src-tauri/
  src/
    main.rs          # 二进制入口，调用 lib::run()
    lib.rs           # Tauri 应用构建与命令注册
  Cargo.toml         # Rust 依赖（tauri v2、serde 等）
  tauri.conf.json    # Tauri 配置（窗口、安全、构建、打包）
  icons/             # 应用图标（多分辨率）
```

### 前后端通信

前端通过 `@tauri-apps/api/core` 的 `invoke("command_name", { args })` 调用 Rust 命令。
Rust 命令使用 `#[tauri::command]` 宏标注，在 `lib.rs` 中通过 `tauri::generate_handler!` 注册。

> 当前后端仅注册了示例命令 `greet`，后续业务命令（如启动游戏、版本管理）均在此扩展。

## 关键配置

| 文件                        | 说明                                                                     |
|-----------------------------|--------------------------------------------------------------------------|
| `eslint.config.js`          | ESLint v10 flat config（TS + SolidJS + Prettier）                        |
| `.prettierrc`               | 双引号、分号、100 字宽、LF 换行                                          |
| `uno.config.ts`             | presetWind4 + presetAttributify + presetIcons                            |
| `tsconfig.json`             | 严格模式，JSX preserve 配合 `solid-js`                                   |
| `src-tauri/tauri.conf.json` | Tauri 配置；开发服务器 `http://localhost:1420`；窗口默认 800x600         |
| `src-tauri/Cargo.toml`      | Rust 依赖；lib 名称 `amethyst_launcher_lib`（避免 Windows DLL 命名冲突） |

### UnoCSS 使用方式

本项目使用 **presetWind4**（Tailwind 语义）编写工具类：

```tsx
<div class="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-lg">
```

> `presetAttributify` 已启用，也可使用属性写法（如 `<div flex items-center>`），但项目中以 `class` 为主。

## 开发约定

- **换行符**：统一 LF（`.gitattributes` 已配置）
- **编码**：UTF-8 无 BOM
- **注释语言**：中文
- **提交信息**：中文，简洁描述变更

### Rust 端

- **命名规范**：函数/变量 `snake_case`，类型 `PascalCase`，常量 `SCREAMING_SNAKE_CASE`
- **错误处理**：优先返回 `Result<T, String>` 而非 panic；复杂场景可引入 `thiserror`
- **模块组织**：按功能划分模块（如 `version.rs`、`java.rs`）
- **路径处理**：使用 `std::path::PathBuf` 处理跨平台路径

### 前端端

- **组件命名**：`PascalCase`（如 `App.tsx`、`VersionList.tsx`）
- **文件命名**：组件文件 `PascalCase.tsx`，工具文件 `camelCase.ts`
- **状态管理**：使用 `createSignal`，避免解构 reactive 值（ESLint 已配置 `solid/no-destructure`）
- **样式编写**：使用 UnoCSS class，避免内联样式
- **未使用变量**：以 `_` 前缀命名（ESLint 已配置 `argsIgnorePattern: "^_"`）

## 常见问题

- **`src-tauri/target` 体积过大**：属正常 Rust 构建产物，已加入 `.gitignore`，无需提交
- **窗口白屏 / 无法启动**：检查是否安装了 WebView2 Runtime；检查 `localhost:1420` 是否被占用
- **构建失败提示缺少依赖**：确保 Rust 工具链完整（`rustup component add rust-src` 一般不需要，但 MSVC 编译工具链必须安装）

## 扩展方向（Minecraft 启动器业务）

后续开发可能涉及以下模块，新增命令和组件时请按职责划分：

- **版本管理**：`.minecraft/versions/` 目录扫描、版本 JSON 解析、Forge/Fabric/NeoForge 安装
- **Java 管理**：自动发现系统 Java、指定 Java 路径、版本兼容性检查
- **账户系统**：Microsoft OAuth、离线账户、外置登录（Authlib-Injector）
- **启动参数**：游戏内存、JVM 参数、自定义分辨率、服务器直连
- **下载器**：版本资源、库文件、资源文件异步下载与校验
