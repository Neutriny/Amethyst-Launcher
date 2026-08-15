import { i18nConfig } from "../../next-i18next.config.mjs";
import zh_Hans from "./zh-Hans.json";
import zh_Hant from "./zh-Hant.json";

type LocaleResources = {
  [key: string]: {
    translation: Record<string, any>;
    display_name: string;
    htmlLang: string;
  };
};

export const localeResources: LocaleResources = {
  "zh-Hans": {
    translation: zh_Hans,
    display_name: "简体中文",
    htmlLang: "zh-Hans",
  },
  "zh-Hant": {
    translation: zh_Hant,
    display_name: "繁體中文",
    htmlLang: "zh-Hant",
  },
};

export const DEFAULT_LOCALE = i18nConfig.defaultLocale;
