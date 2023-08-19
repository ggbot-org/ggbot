import { join } from "node:path"

import { packageDir, packageRootDir } from "@ggbot2/repo"

import { adminDirname } from "./routing/admin/pages.js"

export const rootDir = packageRootDir(import.meta.url)

export const publicDir = packageDir(rootDir, "public")

export const publicAdminDir = join(publicDir, adminDirname)

const srcDir = packageDir(rootDir, "src")

export const typesDir = join(srcDir, "types")

const routingDirname = "routing"

const srcRoutingDir = join(srcDir, routingDirname)

export const landingJs = "/landing.js"
export const landingEntryPoint = join(
	srcRoutingDir,
	"public",
	"LandingRouter.tsx"
)

export const tryFlowJs = "flow.js"
export const tryFlowEntryPoint = join(
	srcRoutingDir,
	"public",
	"TryFlowRouter.tsx"
)

export const userJs = `/app.js`
export const userEntryPoint = join(srcRoutingDir, "user", "Router.tsx")

export const adminJs = `/${adminDirname}/app.js`
export const adminEntryPoint = join(srcRoutingDir, "admin", "Router.tsx")
