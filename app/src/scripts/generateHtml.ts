import { generateHtmlPage, htmlPageContent } from "@ggbot2/html";

import {
  copyStrategyHtmlAppJs,
  copyStrategyHtmlFilename,
  editStrategyFlowHtmlAppJs,
  editStrategyFlowHtmlFilename,
  indexHtmlAppJs,
  indexHtmlFilename,
  manageStrategyHtmlAppJs,
  manageStrategyHtmlFilename,
  publicDir,
  settingsHtmlAppJs,
  settingsHtmlFilename,
  subscriptionCanceledHtmlAppJs,
  subscriptionCanceledHtmlFilename,
  subscriptionPurchasedHtmlAppJs,
  subscriptionPurchasedHtmlFilename,
  viewStrategyFlowHtmlAppJs,
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
    htmlContent: html(indexHtmlAppJs),
  });

  // Strategy

  await generateHtmlPage({
    dirname,
    filename: copyStrategyHtmlFilename,
    htmlContent: html(copyStrategyHtmlAppJs),
  });
  await generateHtmlPage({
    dirname,
    filename: manageStrategyHtmlFilename,
    htmlContent: html(manageStrategyHtmlAppJs),
  });

  // Strategy flow

  await generateHtmlPage({
    dirname,
    filename: editStrategyFlowHtmlFilename,
    htmlContent: html(editStrategyFlowHtmlAppJs),
  });
  await generateHtmlPage({
    dirname,
    filename: viewStrategyFlowHtmlFilename,
    htmlContent: html(viewStrategyFlowHtmlAppJs),
  });

  // Settings

  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("account"),
    htmlContent: html(settingsHtmlAppJs("account")),
  });
  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("billing"),
    htmlContent: html(settingsHtmlAppJs("billing")),
  });
  await generateHtmlPage({
    dirname,
    filename: settingsHtmlFilename("binance"),
    htmlContent: html(settingsHtmlAppJs("binance")),
  });

  // Subscription

  await generateHtmlPage({
    dirname,
    filename: subscriptionCanceledHtmlFilename,
    htmlContent: html(subscriptionCanceledHtmlAppJs),
  });
  await generateHtmlPage({
    dirname,
    filename: subscriptionPurchasedHtmlFilename,
    htmlContent: html(subscriptionPurchasedHtmlAppJs),
  });
};

generateHtml();
