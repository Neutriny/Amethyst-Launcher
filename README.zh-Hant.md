# Amethyst Launcher

**基於 [SJMCL](https://github.com/UNIkeEN/SJMCL) 啟動器原始碼修改的 Minecraft 啟動器**

> 當前圖示為 SJMCL 原版圖示，正在重新設計中

**繁體中文** | [简体中文](README.md)

## 關於本專案

Amethyst Launcher 是基於上海交通大學 Minecraft 社（SJMC）開發的 [SJMCL 啟動器](https://github.com/UNIkeEN/SJMCL) 原始碼進行修改的分支版本。本專案遵循 GPLv3 協議，保留了原專案的核心功能，並進行了以下調整：

- 移除了帳戶頁預設存在的 SJMC 使用者中心登入元件
- 移除了發現頁的社群新聞功能
- 保留了離線登入、微軟登入、MUA 認證伺服器、LittleSkin 及自訂伺服器登入
- 僅保留簡體中文和繁體中文，不再維護其他語言
- 目前僅支援 Windows 平台開發和測試

## 功能特性

* **高效的實例管理**：支援多個遊戲目錄與實例，集中管理所有實例資源（如存檔、模組、資源包、光影包、截圖等）與設定。
* **便捷的資源下載**：支援從 CurseForge 與 Modrinth 等源下載遊戲客戶端、模組載入器、各類遊戲資源與整合包。
* **多帳戶系統支援**：內建 Microsoft 登入與第三方認證伺服器支援，相容 Yggdrasil Connect 的 OAuth 登入流程規範提案。
* **外部服務協同**：透過深度連結與 MCP 服務，與外部網頁、程式及 Agent 服務協同工作，提供一系列便捷功能與自動化能力。
* **開放擴展系統**：支援開發擴展，為啟動器擴展更多有趣且實用的功能。

> 注意：部分功能可能受地區、運行平台或程式分發類型限制。

### 技術堆疊

[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
[![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Chakra UI](https://img.shields.io/badge/chakra_ui-v2-38B2AC?style=for-the-badge&logo=chakraui&logoColor=white&labelColor=319795)](https://v2.chakra-ui.com/)

## 開始使用

前往 [GitHub Releases](https://github.com/TannenWaddy/Amethyst-Launcher/releases) 下載最新版即可。

目前僅支援 Windows 10/11：

| 平台    | 系統版本  | 架構     | 提供的分發類型 |
|---------|-----------|----------|----------------|
| Windows | 10 及以上 | `x86_64` | 安裝版 `.exe`  |

## 開發與貢獻

首先複製本專案並安裝前端依賴：

```bash
git clone https://github.com/TannenWaddy/Amethyst-Launcher.git AML
cd AML
pnpm install
```

使用開發模式運行：

```bash
pnpm tauri dev
```

## 版權聲明

版權所有 © 2024-2026 SJMCL 團隊 | Amethyst 修改版本 © 2025-2026 TannenWaddy

> 本軟體並非官方 Minecraft 服務。未獲得 Mojang 或 Microsoft 批准或關聯許可。

本專案基於 [GNU 通用公共授權條款 v3.0](/LICENSE) 發佈。

原專案：[SJMCL](https://github.com/UNIkeEN/SJMCL) - 上海交通大學 Minecraft 社開發的跨平台 Minecraft 啟動器。

依據 GPLv3 第 7 條款，當您分發本軟體的修改版本時，除遵守 GPLv3 外，還須遵守以下 [附加條款](/LICENSE.EXTRA)：

1. 必須更換軟體名稱，禁止使用 SJMCL 或 SJMC Launcher；
2. 在您的倉庫 README、分發網站或相關文件、軟體的關於頁面中，須明確標註您的程式基於 SJMCL，並註明原倉庫連結。

## 致謝

- 感謝 [SJMCL 團隊](https://github.com/UNIkeEN/SJMCL) 提供的優秀開源專案
- 感謝 [MUA 高校聯盟](https://www.mualliance.cn) 提供的認證伺服器支援

## 聯繫方式

如有問題，請透過 [GitHub Issues](https://github.com/TannenWaddy/Amethyst-Launcher/issues) 聯繫。
