# Amethyst Launcher

**繁體中文** | [简体中文](README.md)

## 關於本專案

Amethyst Launcher 是基於 [SJMCL 啟動器](https://github.com/UNIkeEN/SJMCL) 二次開發的分支專案，在原作基礎上進行了修改與功能擴展，並遵循原專案的 GPL-3.0 許可證開源。

## 功能特性

### 實例與資源管理

- **多目錄多實例**：支援多個遊戲目錄與實例，集中管理所有實例資源（存檔、模組、資源包、光影包、截圖等）與設定。
- **便捷資源下載**：支援從 CurseForge 與 Modrinth 等平台下載遊戲客戶端、模組載入器、各類遊戲資源與整合包。
- **預設資源平台**：可在設定中配置預設資源下載平台（CurseForge / Modrinth），下載時自動優先使用選定平台。
- **整合包匯入**：支援從本機檔案或透過深度連結匯入 CurseForge、Modrinth、MultiMC 格式的整合包。

### 帳戶與登入

- **多帳戶系統**：內建 Microsoft 登入與第三方認證伺服器支援，相容 Yggdrasil Connect 的 OAuth 登入流程規範提案。
- **離線模式**：支援離線帳戶，可自訂角色外觀。

### 智慧功能

- **AI 日誌分析**：遊戲崩潰時可使用 AI 分析遊戲日誌，快速定位崩潰原因並給出修復建議。
- **MCP 服務**：透過 MCP（Model Context Protocol）服務與外部 Agent 協同工作，提供自動化能力與智慧互動。

### 外觀與體驗

- **主題訂製**：支援自訂強調色、顏色模式（淺色/深色/跟隨系統）、背景圖片與字型。
- **液態玻璃效果**：可選的液態玻璃 UI 效果，帶來現代感視覺體驗。
- **語言支援**：支援簡體中文和繁體中文。

## 技術堆疊

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

版權所有 © 2024-2026 SJMCL 團隊 | Amethyst Launcher 修改版本 © 2025-2026 TannenWaddy

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
