# 贡献指南

我们欢迎各种形式的贡献，包括提交问题、新功能、文档改进等。

## 语言偏好

本项目以**中文**为主要沟通语言：

## 行为准则

请遵守基本的开源社区礼仪，尊重每一位参与者。

## 报告问题

使用 [GitHub Issues](https://github.com/Neutriny/Amethyst-Launcher/issues) 提交问题。请使用相应的 Issue 模板，并提供以下信息：

- 问题的复现步骤
- 期望的行为
- 实际的行为
- 运行环境（操作系统、启动器版本等）

提交前请先搜索已有 Issue，避免重复。

## 提交功能建议

如需提出新功能建议，请先创建 Issue 讨论，确认该功能是否适合本项目。

## 提交 Pull Request

提交 PR 前请确保：

- Fork 仓库并创建独立分支
- 本地测试通过
- 代码风格符合项目规范
- 通过 lint 检查（`pnpm lint-staged`）

从未在Github上提交过PR？看一看这一篇 [提交PR指南](https://zhuanlan.zhihu.com/p/1936863607620085328)

## 开发环境

### 前置要求

- [Node.js >= 22](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/learn/get-started)
- [pnpm](https://pnpm.io/)

### 安装依赖

```shell
pnpm install
```

### 运行开发模式

```shell
pnpm tauri dev
```

### 构建

```shell
pnpm tauri build
```
