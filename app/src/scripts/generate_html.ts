import { generateHtmlPage, htmlPageContent } from "@ggbot2/html";

import {
  appJs,
  copyStrategyHtmlFilename,
  editStrategyFlowHtmlFilename,
  indexHtmlFilename,
  manageStrategyHtmlFilename,
  publicDir,
  settingsHtmlFilename,
  subscriptionCanceledHtmlFilename,
  subscriptionPurchasedHtmlFilename,
  viewJs,
  viewStrategyFlowHtmlFilename,
} from "../package.js";

const html = (scriptJs: string) =>
  htmlPageContent({
    hasRootDiv: true,
    meta: { title: "ggbot2" },
    stylesheets: [{ href: "main.css" }],
    scripts: [{ src: scriptJs }],
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
    filename: manageStrategyHtmlFilename,
    htmlContent: html(appJs),
  });

  // Strategy flow

  await generateHtmlPage({
    dirname,
    filename: editStrategyFlowHtmlFilename,
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: viewStrategyFlowHtmlFilename,
    htmlContent: html(viewJs),
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
    filename: subscriptionCanceledHtmlFilename,
    htmlContent: html(appJs),
  });
  await generateHtmlPage({
    dirname,
    filename: subscriptionPurchasedHtmlFilename,
    htmlContent: html(appJs),
  });
};

generateHtml();