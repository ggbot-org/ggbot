import {
  copyStrategyHtmlFilename,
  settingsHtmlFilename,
  strategyHtmlFilename,
  tryFlowHtmlFilename,
} from "./pages.js";
import { strategyKeyToURLSearchParams } from "./strategyKeyParams.js";
import { SettingsPageId, StrategyKey } from "./types.js";

export const href = {
  copyStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${copyStrategyHtmlFilename}?${searchParams}`;
  },
  tryFlowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${tryFlowHtmlFilename}?${searchParams}`;
  },
  homePage: () => "/",
  strategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${strategyHtmlFilename}?${searchParams}`;
  },
  settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`,
};
