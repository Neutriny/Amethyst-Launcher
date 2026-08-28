# Amethyst Launcher

**繁體中文** | [简体中文](README.md)

## 關於本專案

Amethyst Launcher 是使用 Tauri v2 + SolidJS + UnoCSS 全新打造的 Minecraft 啟動器，非 SJMCL 的二次開發或分支專案。

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

### 外觀與體驗

- **主題訂製**：支援自訂強調色、顏色模式（淺色/深色/跟隨系統）、背景圖片與字型。
- **液態玻璃效果**：可選的液態玻璃 UI 效果，帶來現代感視覺體驗。
- **語言支援**：支援簡體中文和繁體中文。

## 技術堆疊

[![Tauri](https://img.shields.io/badge/Tauri_v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
[![SolidJS](https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solidjs&logoColor=white)](https://www.solidjs.com/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-333333?style=for-the-badge&logo=unocss&logoColor=white)](https://unocss.dev/)

## 開始使用

前往 [GitHub Releases](https://github.com/Neutriny/Amethyst-Launcher/releases) 下載最新版即可。

目前僅支援 Windows 10/11：

| 平台    | 系統版本  | 架構     | 提供的分發類型 |
|---------|-----------|----------|----------------|
| Windows | 10 及以上 | `x86_64` | 安裝版 `.exe`  |

## 開發與貢獻

首先複製本專案並安裝前端依賴：

```bash
git clone https://github.com/Neutriny/Amethyst-Launcher.git 
pnpm install
```

使用開發模式運行：

```bash
pnpm tauri dev
```

程式碼格式化：

```bash
pnpm format
```

## 版權聲明

版權所有 © 2025-2026 [Neutriny](https://github.com/Neutriny)

本軟體基於 [MIT 許可證](/LICENSE) 開源。

> 本軟體並非官方 Minecraft 服務。未獲得 Mojang 或 Microsoft 批准或關聯許可。

## 聯繫方式

如有問題，請透過 [GitHub Issues](https://github.com/Neutriny/Amethyst-Launcher/issues) 聯繫。
