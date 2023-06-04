import { generateHtmlPage } from "@ggbot2/html";

import { publicDir } from "../package.js";
import {
  accountSettingsHtmlFilename,
  accountSettingsHtmlPageContent,
} from "../pages/account-settings.html.js";
import {
  billingSettingsHtmlFilename,
  billingSettingsHtmlPageContent,
} from "../pages/billing-settings.html.js";
import {
  binanceSettingsHtmlFilename,
  binanceSettingsHtmlPageContent,
} from "../pages/binance-settings.html.js";
import {
  indexHtmlFilename,
  indexHtmlPageContent,
} from "../pages/index.html.js";

export const generateHtml = async () => {
  const dirname = publicDir;

  await generateHtmlPage({
    dirname,
    filename: indexHtmlFilename,
    htmlContent: indexHtmlPageContent(),
  });

  // Settings

  await generateHtmlPage({
    dirname,
    filename: accountSettingsHtmlFilename,
    htmlContent: accountSettingsHtmlPageContent(),
  });
  await generateHtmlPage({
    dirname,
    filename: billingSettingsHtmlFilename,
    htmlContent: billingSettingsHtmlPageContent(),
  });
  await generateHtmlPage({
    dirname,
    filename: binanceSettingsHtmlFilename,
    htmlContent: binanceSettingsHtmlPageContent(),
  });
};

generateHtml();
