import {
  copyStrategyHtmlFilename,
  editStrategyFlowHtmlFilename,
  manageStrategyHtmlFilename,
  settingsHtmlFilename,
  viewStrategyFlowHtmlFilename,
} from "./pages.js";
import { strategyKeyToURLSearchParams } from "./strategyKeyParams.js";
import { SettingsPageId, StrategyKey } from "./types.js";

export const href = {
  copyStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${copyStrategyHtmlFilename}?${searchParams}`;
  },
  editFlowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${editStrategyFlowHtmlFilename}?${searchParams}`;
  },
  homePage: () => "/",
  manageStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${manageStrategyHtmlFilename}?${searchParams}`;
  },
  settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`,
  viewFlowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${viewStrategyFlowHtmlFilename}?${searchParams}`;
  },
};
