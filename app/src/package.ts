import { join } from "node:path";

import { packageDir, packageRootDir } from "@ggbot2/repo";

import { SettingsPageId } from "./routing/types.js";

export {
  copyStrategyHtmlFilename,
  editStrategyFlowHtmlFilename,
  manageStrategyHtmlFilename,
  settingsHtmlFilename,
  viewStrategyFlowHtmlFilename,
} from "./routing/pages.js";

const rootDir = packageRootDir(import.meta.url);

export const publicDir = packageDir(rootDir, "public");

export const srcDir = packageDir(rootDir, "src");

export const srcPagesDir = join(srcDir, "pages");

export const indexHtmlFilename = "index.html";
export const indexHtmlAppJs = "dashboard.js";
export const indexHtmlEntryPoint = join(srcPagesDir, "Dashboard.tsx");

export const copyStrategyHtmlAppJs = "copy.js";
export const copyStrategyHtmlEntryPoint = join(srcPagesDir, "CopyStrategy.tsx");

export const editStrategyFlowHtmlAppJs = "edit.js";
export const editStrategyFlowHtmlEntryPoint = join(
  srcPagesDir,
  "EditStrategyFlow.tsx"
);

export const manageStrategyHtmlAppJs = "strategy.js";
export const manageStrategyHtmlEntryPoint = join(
  srcPagesDir,
  "ManageStrategy.tsx"
);

export const viewStrategyFlowHtmlAppJs = "view.js";
export const viewStrategyFlowHtmlEntryPoint = join(
  srcPagesDir,
  "ViewStrategyFlow.tsx"
);

export const settingsHtmlAppJs = (settingsPageId: SettingsPageId) =>
  `${settingsPageId}.js`;

export const accountSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "AccountSettings.tsx"
);
export const binanceSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "BinanceSettings.tsx"
);
export const billingSettingsHtmlEntryPoint = join(
  srcPagesDir,
  "BillingSettings.tsx"
);

export const subscriptionCanceledHtmlAppJs = "subscription-canceled.js";
export const subscriptionCanceledHtmlEntryPoint = join(
  srcPagesDir,
  "SubscriptionCanceled.tsx"
);

export const subscriptionPurchasedHtmlAppJs = "subscription-canceled.js";
export const subscriptionPurchasedHtmlEntryPoint = join(
  srcPagesDir,
  "SubscriptionPurchased.tsx"
);
