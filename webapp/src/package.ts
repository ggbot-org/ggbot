import { join } from "node:path"

import { packageRootDir } from "@workspace/package"

import { adminDirname } from "./routing/admin/pages.js"
import { designDirname } from "./routing/design/pages.js"
import { userDirname } from "./routing/user/pages.js"

export const rootDir = packageRootDir(import.meta.url)

export const publicDir = join(rootDir, "public")

const srcDir = join(rootDir, "src")

export const typesDir = join(srcDir, "types")

const routingDirname = "routing"

const srcRoutingDir = join(srcDir, routingDirname)

export const landingJs = "landing.js"
export const landingEntryPoint = join(
	srcRoutingDir,
	"public",
	"LandingRouter.tsx"
)

export const strategyJs = "strategy.js"
export const strategyEntryPoint = join(
	srcRoutingDir,
	"public",
	"StrategyRouter.tsx"
)

export const userJs = `/${userDirname}/app.js`
export const userEntryPoint = join(srcRoutingDir, "user", "Router.tsx")

export const adminJs = `/${adminDirname}/app.js`
export const adminEntryPoint = join(srcRoutingDir, adminDirname, "Router.tsx")

export const designJs = `/${designDirname}/app.js`
export const designEntryPoint = join(srcRoutingDir, "design", "Router.tsx")
