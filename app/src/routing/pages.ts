import { UtrustCancelURL, UtrustReturnURL } from "@ggbot2/locators";

import { SettingsPageId } from "./types.js";

export const copyStrategyHtmlFilename = "copy-strategy.html";

export const editStrategyFlowHtmlFilename = "edit.html";

export const manageStrategyHtmlFilename = "strategy.html";

export const settingsHtmlFilename = (id: SettingsPageId) =>
  `${id}-settings.html`;

export const subscriptionCanceledHtmlFilename = UtrustCancelURL.htmlFileName;

export const subscriptionPurchasedHtmlFilename = UtrustReturnURL.htmlFileName;

export const viewStrategyFlowHtmlFilename = "view.html";
