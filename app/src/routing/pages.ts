import { SettingsPageId } from "./types.js";

export const copyStrategyHtmlFilename = "copy-strategy.html";

export const editStrategyFlowHtmlFilename = "edit.html";

export const manageStrategyHtmlFilename = "strategy.html";

export const settingsHtmlFilename = (id: SettingsPageId) =>
  `${id}-settings.html`;

export const viewStrategyFlowHtmlFilename = "view.html";
