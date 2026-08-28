import { defineConfig, presetWind4, presetAttributify, presetIcons } from "unocss";

export default defineConfig({
  presets: [presetWind4(), presetAttributify(), presetIcons()],
});
