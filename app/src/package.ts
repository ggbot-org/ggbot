import { join } from "node:path";

import { packageDir, packageRootDir } from "@ggbot2/repo";
import { today } from "@ggbot2/time";

export * from "./routing/pages.js";

export const rootDir = packageRootDir(import.meta.url);

export const publicDir = packageDir(rootDir, "public");

export const srcDir = packageDir(rootDir, "src");

const srcRoutingDir = join(srcDir, "routing");

const version = today();

export const appJs = `app.${version}.js`;
export const appEntryPoint = join(srcRoutingDir, "AppRouter.tsx");

export const tryFlowJs = `flow.${version}.js`;
export const tryFlowEntryPoint = join(srcRoutingDir, "TryFlowRouter.tsx");
