# Amethyst Launcher

**简体中文** | [繁體中文](README.zh-Hant.md)

## 关于本项目

Amethyst Launcher 是基于 [SJMCL 启动器](https://github.com/UNIkeEN/SJMCL) 二次开发的分支项目，在原作基础上进行了修改与功能扩展，并遵循原项目的 GPL-3.0 许可证开源。

## 功能特性

### 实例与资源管理

- **多目录多实例**：支持多个游戏目录与实例，集中管理所有实例资源（存档、模组、资源包、光影包、截图等）与设置。
- **便捷资源下载**：支持从 CurseForge 与 Modrinth 等平台下载游戏客户端、模组加载器、各类游戏资源与整合包。
- **默认资源平台**：可在设置中配置默认资源下载平台（CurseForge / Modrinth），下载时自动优先使用选定平台。
- **整合包导入**：支持从本地文件或通过深度链接导入 CurseForge、Modrinth、MultiMC 格式的整合包。

### 账户与登录

- **多账户系统**：内置 Microsoft 登录与第三方认证服务器支持，兼容 Yggdrasil Connect 的 OAuth 登录流程规范提案。
- **离线模式**：支持离线账户，可自定义角色皮肤。

### 智能功能

- **AI 日志分析**：游戏崩溃时可使用 AI 分析游戏日志，快速定位崩溃原因并给出修复建议。
- **MCP 服务**：通过 MCP（Model Context Protocol）服务与外部 Agent 协同工作，提供自动化能力与智能交互。

### 外观与体验

- **主题定制**：支持自定义强调色、颜色模式（浅色/深色/跟随系统）、背景图片与字体。
- **液态玻璃效果**：可选的液态玻璃 UI 效果，带来现代感视觉体验。
- **语言支持**：支持简体中文和繁体中文。

## 技术栈

[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
[![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Chakra UI](https://img.shields.io/badge/chakra_ui-v2-38B2AC?style=for-the-badge&logo=chakraui&logoColor=white&labelColor=319795)](https://v2.chakra-ui.com/)

## 开始使用

前往 [GitHub Releases](https://github.com/Neutriny/Amethyst-Launcher/releases) 下载最新版即可。

目前仅支持 Windows 10/11：

| 平台    | 系统版本  | 架构     | 提供的分发类型 |
|---------|-----------|----------|----------------|
| Windows | 10 及以上 | `x86_64` | 安装版 `.exe`  |

## 开发与贡献

首先克隆本项目并安装前端依赖：

```bash
git clone https://github.com/Neutriny/Amethyst-Launcher.git AML
cd AML
pnpm install
```

使用开发模式运行：

```bash
pnpm tauri dev
```

## 版权声明

版权所有 © 2024-2026 SJMCL 团队 | Amethyst Launcher 修改版本 © 2025-2026 Neutriny

> 本软件并非官方 Minecraft 服务。未获得 Mojang 或 Microsoft 批准或关联许可。

本项目基于 [GNU 通用公共许可证 v3.0](/LICENSE) 发布。

原项目：[SJMCL](https://github.com/UNIkeEN/SJMCL) - 上海交通大学 Minecraft 社开发的跨平台 Minecraft 启动器。

依据 GPLv3 第 7 条款，当您分发本软件的修改版本时，除遵守 GPLv3 外，还须遵守以下 [附加条款](/LICENSE.EXTRA)：

1. 必须更换软件名称，禁止使用 SJMCL 或 SJMC Launcher；
2. 在您的仓库 README、分发网站或相关文档、软件的关于页面中，须明确标注您的程序基于 SJMCL，并注明原仓库链接。

## 致谢

- 感谢 [SJMCL 团队](https://github.com/UNIkeEN/SJMCL) 提供的优秀开源项目
- 感谢 [MUA 高校联盟](https://www.mualliance.cn) 提供的认证服务器支持

## 联系方式

如有问题，请通过 [GitHub Issues](https://github.com/Neutriny/Amethyst-Launcher/issues) 联系。
