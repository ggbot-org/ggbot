import { generateHtmlPage, htmlPageContent } from "@ggbot2/html";

import {
  appJs,
  copyStrategyHtmlFilename,
  indexHtmlFilename,
  publicDir,
  purchaseCanceledHtmlFilename,
  settingsHtmlFilename,
  strategyHtmlFilename,
  subscriptionPurchasedHtmlFilename,
  tryFlowHtmlFilename,
  tryFlowJs,
} from "../package.js";

const html = (scriptJs: string) =>
  htmlPageContent({
    hasRootDiv: true,
    meta: { title: "ggbot2" },
    scripts: [{ src: scriptJs }],
    stylesheets: [{ href: "main.css" }],
  });

export const generateHtml = async () => {
  const dirname = publicDir;

  // Homepage

  await generateHtmlPage({
    dirname,
    filename: indexHtmlFilename,
    htmlContent: html(appJs),
  });

  // Strategy

  await generateHtmlPage({
    dirname,
    filename: copyStrategyHtmlFilename,
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: strategyHtmlFilename,
    htmlContent: html(appJs),
  });

  // Flow

  await generateHtmlPage({
    dirname,
    filename: tryFlowHtmlFilename,
    htmlContent: html(tryFlowJs),
  });

  // Settings

  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("account"),
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("billing"),
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("binance"),
    htmlContent: html(appJs),
  });

  // Subscription

  await generateHtmlPage({
    dirname,
    filename: purchaseCanceledHtmlFilename,
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: subscriptionPurchasedHtmlFilename,
    htmlContent: html(appJs),
  });
};

generateHtml();
