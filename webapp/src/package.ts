import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { WorkerName, workerScriptPath } from '_/workers'
import { webappDirname } from '@workspace/locators'

export const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

const monorepoDir = dirname(workspaceDir)

export const publicDir = join(workspaceDir, 'public')
export const sitemap = join(publicDir, 'sitemap.xml')

const srcDir = join(workspaceDir, 'src')

export const typesDir = join(srcDir, 'types')

function routingFile(filename: string) {
	return join(srcDir, 'routing', filename)
}

type AppName = 'admin' | 'design' | 'landing' | 'strategy' | 'user'

type EcmaScriptName = AppName | WorkerName

const ecmaScriptPath: Record<EcmaScriptName, string[]> = {
	landing: ['landing.js'],
	strategy: ['strategy.js'],
	user: [webappDirname.user, 'app.js'],
	admin: [webappDirname.admin, 'app.js'],
	design: [webappDirname.design, 'app.js'],
	...workerScriptPath
}

export const webappEcmaScriptsConfig: Record<EcmaScriptName, {
	entryPoint: string
	jsPath: string[]
}> = {
	landing: {
		entryPoint: routingFile('RouterLanding.tsx'),
		jsPath: ecmaScriptPath.landing
	},
	strategy: {
		entryPoint: routingFile('RouterSharedStrategy.tsx'),
		jsPath: ecmaScriptPath.strategy
	},
	user: {
		entryPoint: routingFile('RouterUser.tsx'),
		jsPath: ecmaScriptPath.user
	},
	admin: {
		entryPoint: routingFile('RouterAdmin.tsx'),
		jsPath: ecmaScriptPath.admin
	},
	design: {
		entryPoint: routingFile('RouterDesign.tsx'),
		jsPath: ecmaScriptPath.design
	},
	backtesting: {
		entryPoint: join(monorepoDir, 'backtesting-webworker', 'src/index.ts'),
		jsPath: ecmaScriptPath.backtesting
	}
}
