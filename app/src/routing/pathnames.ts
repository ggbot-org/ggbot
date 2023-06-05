import { settingsHtmlFilename } from "../pages/_settings.js";
import { copyStrategyHtmlFilename } from "../pages/copy-strategy.html.js";
import { editStrategyFlowHtmlFilename } from "../pages/edit-strategy-flow.html.js";
import { manageStrategyHtmlFilename } from "../pages/manage-strategy.html.js";
import { viewStrategyFlowHtmlFilename } from "../pages/view-strategy-flow.html.js";
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
