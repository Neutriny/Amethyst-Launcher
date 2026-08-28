# Amethyst Launcher

**简体中文** | [繁體中文](README.zh-Hant.md)

## 关于本项目

Amethyst Launcher 是使用 Tauri v2 + SolidJS + UnoCSS 全新打造的 Minecraft 启动器

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

### 外观与体验

- **主题定制**：支持自定义强调色、颜色模式（浅色/深色/跟随系统）、背景图片与字体。
- **液态玻璃效果**：可选的液态玻璃 UI 效果，带来现代感视觉体验。
- **语言支持**：支持简体中文和繁体中文。

## 技术栈

[![Tauri](https://img.shields.io/badge/Tauri_v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
![pnpm](https://img.shields.io/badge/pnpm-v11.15-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![SolidJS](https://img.shields.io/badge/SolidJS-v1.9-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-v7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![UnoCSS](https://img.shields.io/badge/UnoCSS-v66.5-333333?style=for-the-badge&logo=unocss&logoColor=white)

## 开始使用

前往 [GitHub Releases](https://github.com/Neutriny/Amethyst-Launcher/releases) 下载最新版即可。

目前仅支持 Windows 10/11：

| 平台    | 系统版本  | 架构     | 提供的分发类型 |
|---------|-----------|----------|----------------|
| Windows | 10 及以上 | `x86_64` | 安装版 `.exe`  |

## 开发与贡献

首先克隆本项目并安装前端依赖：

```shell
git clone https://github.com/Neutriny/Amethyst-Launcher.git 
pnpm install
```

使用开发模式运行：

```shell
pnpm tauri dev
```

代码格式化：

```shell
pnpm format
```

## 版权声明

版权所有 © 2025-2026 [Neutriny](https://github.com/Neutriny)

本软件基于 [MIT 许可证](/LICENSE) 开源。

> 本软件并非官方 Minecraft 服务。未获得 Mojang 或 Microsoft 批准或关联许可。

## 联系方式

如有问题，请通过 [GitHub Issues](https://github.com/Neutriny/Amethyst-Launcher/issues) 联系。
