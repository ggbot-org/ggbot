import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { webappDirname } from "@workspace/locators"

import { WorkerName, workerScriptPath } from "_/workers"

export const workspaceDir = resolve(
	dirname(dirname(fileURLToPath(import.meta.url)))
)

const monorepoDir = dirname(workspaceDir)

export const publicDir = join(workspaceDir, "public")
export const sitemap = join(publicDir, "sitemap.xml")

const srcDir = join(workspaceDir, "src")

export const typesDir = join(srcDir, "types")

const srcRoutingDir = join(srcDir, "routing")
const srcPublicRoutingDir = join(srcRoutingDir, "public")

type AppName = "admin" | "design" | "landing" | "strategy" | "user"

type EcmaScriptName = AppName | WorkerName

const ecmaScriptPath: Record<EcmaScriptName, string[]> = {
	landing: ["landing.js"],
	strategy: ["strategy.js"],
	user: [webappDirname.user, "app.js"],
	admin: [webappDirname.admin, "app.js"],
	design: [webappDirname.design, "app.js"],
	...workerScriptPath
}

export const webappEcmaScriptsConfig: Record<
	EcmaScriptName,
	{
		entryPoint: string
		jsPath: string[]
	}
> = {
	landing: {
		entryPoint: join(srcPublicRoutingDir, "LandingRouter.tsx"),
		jsPath: ecmaScriptPath.landing
	},
	strategy: {
		entryPoint: join(srcPublicRoutingDir, "StrategyRouter.tsx"),
		jsPath: ecmaScriptPath.strategy
	},
	user: {
		entryPoint: join(srcRoutingDir, webappDirname.user, "Router.tsx"),
		jsPath: ecmaScriptPath.user
	},
	admin: {
		entryPoint: join(srcRoutingDir, webappDirname.admin, "Router.tsx"),
		jsPath: ecmaScriptPath.admin
	},
	design: {
		entryPoint: join(srcRoutingDir, webappDirname.design, "Router.tsx"),
		jsPath: ecmaScriptPath.design
	},
	backtesting: {
		entryPoint: join(monorepoDir, "backtesting-webworker", "src/index.ts"),
		jsPath: ecmaScriptPath.backtesting
	}
}
