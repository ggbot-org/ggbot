import {
  copyStrategyHtmlFilename,
  flowHtmlFilename,
  settingsHtmlFilename,
  strategyHtmlFilename,
} from "./pages.js";
import { strategyKeyToURLSearchParams } from "./strategyKeyParams.js";
import { SettingsPageId, StrategyKey } from "./types.js";

export const href = {
  copyStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${copyStrategyHtmlFilename}?${searchParams}`;
  },
  flowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${flowHtmlFilename}?${searchParams}`;
  },
  homePage: () => "/",
  strategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${strategyHtmlFilename}?${searchParams}`;
  },
  settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`,
};
