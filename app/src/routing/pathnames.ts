import {
  copyStrategyHtmlFilename,
  editStrategyFlowHtmlFilename,
  manageStrategyHtmlFilename,
  settingsHtmlFilename,
  viewStrategyFlowHtmlFilename,
} from "./pages.js";
import { strategyKeyToURLSearchParams } from "./strategyKeyParams.js";
import { SettingsPageId, StrategyKey } from "./types.js";

export const pathname = {
  // TODO remove authPage pathname
  authPage: () => "/auth",
  copyStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${copyStrategyHtmlFilename}?${searchParams}`;
  },
  editFlowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${editStrategyFlowHtmlFilename}?${searchParams}`;
  },
  homePage: () => "/",
  settingsPage: (id: SettingsPageId) => `/${settingsHtmlFilename(id)}`,
  manageStrategyPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${manageStrategyHtmlFilename}?${searchParams}`;
  },
  viewFlowPage: (strategyKey: StrategyKey) => {
    const searchParams = strategyKeyToURLSearchParams(strategyKey).toString();
    return `/${viewStrategyFlowHtmlFilename}?${searchParams}`;
  },
};
