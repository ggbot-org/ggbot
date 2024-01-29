import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { workersDirname } from "_/workers"
import { webappDirname } from "@workspace/locators"

export const packageDir = resolve(
	dirname(dirname(fileURLToPath(import.meta.url)))
)

export const publicDir = join(packageDir, "public")
export const sitemap = join(publicDir, "sitemap.xml")

const srcDir = join(packageDir, "src")

export const typesDir = join(srcDir, "types")

const srcRoutingDir = join(srcDir, "routing")
const srcPublicRoutingDir = join(srcRoutingDir, "public")

const srcWorkersDir = join(srcDir, workersDirname)

type EcmaScriptName =
	| "admin"
	| "backtesting"
	| "design"
	| "landing"
	| "strategy"
	| "user"

const ecmaScriptPath: Record<EcmaScriptName, string[]> = {
	landing: ["landing.js"],
	strategy: ["strategy.js"],
	user: [webappDirname.user, "app.js"],
	admin: [webappDirname.admin, "app.js"],
	design: [webappDirname.design, "app.js"],
	backtesting: [workersDirname, "backtesting.js"]
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
		entryPoint: join(srcWorkersDir, "backtesting.ts"),
		jsPath: ecmaScriptPath.backtesting
	}
}
