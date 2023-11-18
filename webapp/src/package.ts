import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
	adminDirname,
	designDirname,
	userDirname,
	workersDirname
} from "./dirnames.js"
import { EcmaScriptName, ecmaScriptPath } from "./ecmaScripts.js"

export const packageDir = resolve(
	dirname(dirname(fileURLToPath(import.meta.url)))
)

export const publicDir = join(packageDir, "public")

const srcDir = join(packageDir, "src")

export const typesDir = join(srcDir, "types")

const srcRoutingDir = join(srcDir, "routing")
const srcPublicRoutingDir = join(srcRoutingDir, "public")

const srcWorkersDir = join(srcDir, workersDirname)

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
		entryPoint: join(srcRoutingDir, userDirname, "Router.tsx"),
		jsPath: ecmaScriptPath.user
	},
	admin: {
		entryPoint: join(srcRoutingDir, adminDirname, "Router.tsx"),
		jsPath: ecmaScriptPath.admin
	},
	design: {
		entryPoint: join(srcRoutingDir, designDirname, "Router.tsx"),
		jsPath: ecmaScriptPath.design
	},
	backtesting: {
		entryPoint: join(srcWorkersDir, "backtesting.ts"),
		jsPath: ecmaScriptPath.backtesting
	}
}
