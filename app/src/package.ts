import { join } from "node:path";

import { packageDir, packageRootDir } from "@ggbot2/repo";
import { today } from "@ggbot2/time";

export {
  copyStrategyHtmlFilename,
  flowHtmlFilename,
  indexHtmlFilename,
  settingsHtmlFilename,
  strategyHtmlFilename,
  subscriptionCanceledHtmlFilename,
  subscriptionPurchasedHtmlFilename,
} from "./routing/pages.js";

const rootDir = packageRootDir(import.meta.url);

export const publicDir = packageDir(rootDir, "public");

export const srcDir = packageDir(rootDir, "src");

export const srcPagesDir = join(srcDir, "pages");
export const srcRoutingDir = join(srcDir, "routing");

const version = today();

export const appJs = `app.${version}.js`;
export const appEntryPoint = join(srcRoutingDir, "AppRouter.tsx");

export const flowJs = `flow.${version}.js`;
export const flowEntryPoint = join(srcRoutingDir, "FlowRouter.tsx");
