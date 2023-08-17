import { join } from "node:path"

import { packageDir, packageRootDir } from "@ggbot2/repo"

export * from "./routing/pages.js"

export const rootDir = packageRootDir(import.meta.url)

export const publicDir = packageDir(rootDir, "public")

const srcDir = packageDir(rootDir, "src")

export const typesDir = join(srcDir, "types")

const srcRoutingDir = join(srcDir, "routing")

export const appJs = `app.js`
export const appEntryPoint = join(srcRoutingDir, "AppRouter.tsx")

export const adminDashboardJs = `admin.js`
export const adminDashboardEntryPoint = join(srcRoutingDir, "AdminRouter.tsx")

export const tryFlowJs = `flow.js`
export const tryFlowEntryPoint = join(srcRoutingDir, "TryFlowRouter.tsx")
