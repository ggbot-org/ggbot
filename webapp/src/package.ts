import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { adminDirname } from "./routing/admin/pages.js"
import { designDirname } from "./routing/design/pages.js"
import { userDirname } from "./routing/user/pages.js"

export const packageDir = resolve(
	dirname(dirname(fileURLToPath(import.meta.url)))
)

export const publicDir = join(packageDir, "public")

const srcDir = join(packageDir, "src")

export const typesDir = join(srcDir, "types")

const srcRoutingDir = join(srcDir, "routing")
const srcPublicRoutingDir = join(srcRoutingDir, "public")

const workersDirname = "workers"
const srcWorkersDir = join(srcDir, workersDirname)

export const webappEcmaScriptsConfig: Record<
	string,
	{
		entryPoint: string
		jsPath: string[]
	}
> = {
	landing: {
		entryPoint: join(srcPublicRoutingDir, "LandingRouter.tsx"),
		jsPath: ["landing.js"]
	},
	strategy: {
		entryPoint: join(srcPublicRoutingDir, "StrategyRouter.tsx"),
		jsPath: ["strategy.js"]
	},
	user: {
		entryPoint: join(srcRoutingDir, userDirname, "Router.tsx"),
		jsPath: [userDirname, "app.js"]
	},
	admin: {
		entryPoint: join(srcRoutingDir, adminDirname, "Router.tsx"),
		jsPath: [adminDirname, "app.js"]
	},
	design: {
		entryPoint: join(srcRoutingDir, designDirname, "Router.tsx"),
		jsPath: [designDirname, "app.js"]
	},
	backtesting: {
		entryPoint: join(srcWorkersDir, "backtesting.ts"),
		jsPath: [workersDirname, "backtesting.js"]
	}
}
