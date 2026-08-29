import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [UnoCSS(), solid()],

  // Vite 选项针对 Tauri 开发进行调整，仅在 `tauri dev` 或 `tauri build` 时生效
  //
  // 1. 防止 Vite 遮蔽 Rust 错误
  clearScreen: false,
  // 2. Tauri 使用固定端口，若端口不可用则启动失败
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. 告诉 Vite 忽略监视 `src-tauri` 目录
      ignored: ["**/src-tauri/**"],
    },
  },
}));
