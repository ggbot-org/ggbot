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

const srcAdminDir = join(srcDir, adminDirname)
const srcAdminRoutingDir = join(srcAdminDir, routingDirname)

const srcPublicDir = join(srcDir, "public")
const srcPublicRoutingDir = join(srcPublicDir, routingDirname)

export const landingJs = "/landing.js"

export const appJs = `/app.js`
export const appEntryPoint = join(srcRoutingDir, "AppRouter.tsx")

export const adminJs = `/${adminDirname}/app.js`
export const adminEntryPoint = join(srcAdminRoutingDir, "Router.tsx")

export const tryFlowJs = `flow.js`
export const tryFlowEntryPoint = join(srcPublicRoutingDir, "TryFlowRouter.tsx")
