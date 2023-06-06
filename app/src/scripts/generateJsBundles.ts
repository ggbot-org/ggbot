import { join } from "node:path";

import { browserBundle } from "@ggbot2/esbuild";

import {
  accountSettingsHtmlEntryPoint,
  billingSettingsHtmlEntryPoint,
  binanceSettingsHtmlEntryPoint,
  copyStrategyHtmlAppJs,
  copyStrategyHtmlEntryPoint,
  editStrategyFlowHtmlAppJs,
  editStrategyFlowHtmlEntryPoint,
  indexHtmlAppJs,
  indexHtmlEntryPoint,
  manageStrategyHtmlAppJs,
  manageStrategyHtmlEntryPoint,
  publicDir,
  settingsHtmlAppJs,
  subscriptionCanceledHtmlAppJs,
  subscriptionCanceledHtmlEntryPoint,
  subscriptionPurchasedHtmlAppJs,
  subscriptionPurchasedHtmlEntryPoint,
  viewStrategyFlowHtmlAppJs,
  viewStrategyFlowHtmlEntryPoint,
} from "../package.js";

const generateJsBundles = async () => {
  // Homepage

  await browserBundle({
    entryPoints: [indexHtmlEntryPoint],
    outfile: join(publicDir, indexHtmlAppJs),
  });

  // Strategy

  await browserBundle({
    entryPoints: [copyStrategyHtmlEntryPoint],
    outfile: join(publicDir, copyStrategyHtmlAppJs),
  });
  await browserBundle({
    entryPoints: [manageStrategyHtmlEntryPoint],
    outfile: join(publicDir, manageStrategyHtmlAppJs),
  });

  // Strategy flow

  await browserBundle({
    entryPoints: [editStrategyFlowHtmlEntryPoint],
    outfile: join(publicDir, editStrategyFlowHtmlAppJs),
  });
  await browserBundle({
    entryPoints: [viewStrategyFlowHtmlEntryPoint],
    outfile: join(publicDir, viewStrategyFlowHtmlAppJs),
  });

  // Settings

  await browserBundle({
    entryPoints: [accountSettingsHtmlEntryPoint],
    outfile: join(publicDir, settingsHtmlAppJs("account")),
  });
  await browserBundle({
    entryPoints: [billingSettingsHtmlEntryPoint],
    outfile: join(publicDir, settingsHtmlAppJs("billing")),
  });
  await browserBundle({
    entryPoints: [binanceSettingsHtmlEntryPoint],
    outfile: join(publicDir, settingsHtmlAppJs("binance")),
  });

  // Subscription

  await browserBundle({
    entryPoints: [subscriptionCanceledHtmlEntryPoint],
    outfile: join(publicDir, subscriptionCanceledHtmlAppJs),
  });
  await browserBundle({
    entryPoints: [subscriptionPurchasedHtmlEntryPoint],
    outfile: join(publicDir, subscriptionPurchasedHtmlAppJs),
  });
};

generateJsBundles();
