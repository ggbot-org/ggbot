import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { WorkerName, workerScriptPath } from '_/workers'
import { webappDirname } from '@workspace/locators'
import readFile from 'read-file-utf8'

export const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

export const monorepoDir = dirname(workspaceDir)

export const nodeModulesDir = join(monorepoDir, 'node_modules')

export const publicDir = join(workspaceDir, 'public')

export const publicModulesDirname = 'modules'

/**
 *
 * @remarks
 *
 * Public modules are in a folder like
 *
 * ```
 * /modules/mylib-v1.2.3.js
 * /modules/another-lib-v4.5.6.js
 * ```
 */
function publicModule(moduleName: string, version: string) {
	return [publicModulesDirname, `${moduleName}-v${version}.js`]
}

const srcDir = join(workspaceDir, 'src')

export const typesDir = join(srcDir, 'types')

const pkg = await readFile<{ dependencies: Record<string, string> }>(join(workspaceDir, 'package.json'))

const preactVersion = pkg.dependencies.preact

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

/**
 * Info to generate importmap script to share JS modules across apps.
 * The key is the import name, will be marked as "external" in esbuild config to be excluded from the JS bundles.
*/
export const importmapConfig: Record<string, {
	nodeModulePath: string[]
	publicModulePath: string[]
}> = {
	preact: {
		nodeModulePath: ['preact', 'dist', 'preact.module.js'],
		publicModulePath: publicModule('preact', preactVersion)
	},
	'preact/compat': {
		nodeModulePath:	['preact', 'compat', 'dist', 'compat.module.js'],
		publicModulePath: publicModule('preact-compat', preactVersion)
	},
	'preact/compat/client': {
		nodeModulePath:	['preact', 'compat', 'client.mjs'],
		publicModulePath: publicModule('preact-compat-client', preactVersion)
	},
	'preact/hooks': {
		nodeModulePath:	['preact', 'hooks', 'dist', 'hooks.mjs'],
		publicModulePath: publicModule('preact-hooks', preactVersion)
	},
	'preact/jsx-runtime': {
		nodeModulePath:	['preact', 'jsx-runtime', 'dist', 'jsxRuntime.module.js'],
		publicModulePath: publicModule('preact-jsx-runtime', preactVersion)
	}
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
