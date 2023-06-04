import { join } from "node:path";

import { browserBundle } from "@ggbot2/esbuild";

import { publicDir } from "../package.js";
import {
  accountSettingsHtmlAppJs,
  accountSettingsHtmlEntryPoint,
} from "../pages/account-settings.html.js";
import {
  billingSettingsHtmlAppJs,
  billingSettingsHtmlEntryPoint,
} from "../pages/billing-settings.html.js";
import {
  binanceSettingsHtmlAppJs,
  binanceSettingsHtmlEntryPoint,
} from "../pages/binance-settings.html.js";
import { indexHtmlAppJs, indexHtmlEntryPoint } from "../pages/index.html.js";

const generateJsBundles = async () => {
  await browserBundle({
    entryPoints: [indexHtmlEntryPoint],
    outfile: join(publicDir, indexHtmlAppJs),
  });

  // Settings

  await browserBundle({
    entryPoints: [accountSettingsHtmlEntryPoint],
    outfile: join(publicDir, accountSettingsHtmlAppJs),
  });
  await browserBundle({
    entryPoints: [billingSettingsHtmlEntryPoint],
    outfile: join(publicDir, billingSettingsHtmlAppJs),
  });
  await browserBundle({
    entryPoints: [binanceSettingsHtmlEntryPoint],
    outfile: join(publicDir, binanceSettingsHtmlAppJs),
  });
};

generateJsBundles();
