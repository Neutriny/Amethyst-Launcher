# ArcMC Launcher

**基于 [SJMCL](https://github.com/UNIkeEN/SJMCL) 启动器源码修改的 Minecraft 启动器**

> 当前图标为 SJMCL 原版图标，本人正在重新设计

**简体中文** | [繁體中文](README.zh-Hant.md)

## 关于本项目

ArcMC Launcher 是基于上海交通大学 Minecraft 社（SJMC）开发的 [SJMCL 启动器](https://github.com/UNIkeEN/SJMCL) 源码进行修改的分支版本。本项目遵循 GPLv3 协议，保留了原项目的核心功能，并进行了以下调整：

- 移除了账户页默认存在的 SJMC 用户中心登录组件
- 移除了发现页的社区新闻功能
- 保留了离线登录、微软登录、MUA 认证服务器、LittleSkin 及自定义服务器登录
- 仅保留简体中文和繁体中文，不再维护其他语言
- 目前仅支持 Windows 平台开发和测试

## 功能特性

* **高效的实例管理**：支持多个游戏目录与实例，集中管理所有实例资源（如存档、模组、资源包、光影包、截图等）与设置。
* **便捷的资源下载**：支持从 CurseForge 与 Modrinth 等源下载游戏客户端、模组加载器、各类游戏资源与整合包。
* **多账户系统支持**：内置 Microsoft 登录与第三方认证服务器支持，兼容 Yggdrasil Connect 的 OAuth 登录流程规范提案。
* **外部服务协同**：通过深度链接与 MCP 服务，与外部网页、程序及 Agent 服务协同工作，提供一系列便捷功能与自动化能力。
* **开放扩展系统**：支持开发扩展，为启动器扩展更多有趣且实用的功能。

> 注意：部分功能可能受地区、运行平台或程序分发类型限制。

### 技术栈

[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
[![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Chakra UI](https://img.shields.io/badge/chakra_ui-v2-38B2AC?style=for-the-badge&logo=chakraui&logoColor=white&labelColor=319795)](https://v2.chakra-ui.com/)

## 开始使用

前往 [GitHub Releases](https://github.com/TannenWaddy/ArcMC-Launcher/releases) 下载最新版即可。

目前仅支持 Windows 10/11：

| 平台    | 系统版本  | 架构     | 提供的分发类型 |
|---------|-----------|----------|----------------|
| Windows | 10 及以上 | `x86_64` | 安装版 `.exe`  |

## 开发与贡献

首先克隆本项目并安装前端依赖：

```bash
git clone https://github.com/TannenWaddy/ArcMC-Launcher.git
cd ArcMC
pnpm install
```

使用开发模式运行：

```bash
pnpm tauri dev
```

## 版权声明

版权所有 © 2024-2026 SJMCL 团队 | ArcMC 修改版本 © 2025-2026 TannenWaddy

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

如有问题，请通过 [GitHub Issues](https://github.com/TannenWaddy/ArcMC-Launcher/issues) 联系。
