import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { webappDirname } from '@workspace/locators'
import readFile from 'read-file-utf8'

import { WorkerName, workerScriptPath } from './workers.js'

export const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

export const monorepoDir = dirname(workspaceDir)

export const nodeModulesDir = join(monorepoDir, 'node_modules')

export const publicDir = join(workspaceDir, 'public')

const publicModuleDirname = 'modules'

const srcDir = join(workspaceDir, 'src')

export const typesDir = join(srcDir, 'types')

const pkg = await readFile<{ dependencies: Record<string, string> }>(join(workspaceDir, 'package.json'))

const preactVersion = pkg.dependencies.preact
const preactPublicDir = [publicModuleDirname, `preact-${preactVersion}`]

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
	/** Path to source module directory, relative to node_modules folder. */
	sourceDir: string[]
	/** Original filename as found in source directory. */
	sourceFile: string
	/** Path to public module directory, relative to webapp public folder. */
	targetDir: string[]
	/** The `sourceFile` name may differ from original `targetFile` name to have better DX, for example when looking at Network tab in browser dev tools. */
	targetFile: string
	/** Optional source map filename, must be same as linked in module file last line comment. */
	sourceMap?: string
}> = {
	preact: {
		sourceDir: ['preact', 'dist'],
		sourceFile: 'preact.module.js',
		sourceMap: 'preact.module.js.map',
		targetDir: preactPublicDir,
		targetFile: 'preact.js',
	},
	'preact/compat': {
		sourceDir:	['preact', 'compat', 'dist'],
		sourceFile:	'compat.module.js',
		sourceMap:	'compat.module.js.map',
		targetDir: preactPublicDir,
		targetFile:	'preact-compat.js',
	},
	'preact/compat/client': {
		sourceDir:	['preact', 'compat'],
		sourceFile:	'client.mjs',
		targetDir: preactPublicDir,
		targetFile:	'preact-compat-client.js',
	},
	'preact/hooks': {
		sourceDir:	['preact', 'hooks', 'dist'],
		sourceFile:	'hooks.module.js',
		sourceMap:	'hooks.module.js.map',
		targetDir: preactPublicDir,
		targetFile:	'preat-hooks.js',
	},
	'preact/jsx-runtime': {
		sourceDir:	['preact', 'jsx-runtime', 'dist'],
		sourceFile:	'jsxRuntime.module.js',
		sourceMap:	'jsxRuntime.module.js.map',
		targetDir: preactPublicDir,
		targetFile:	'preact-jsx-runtime.js',
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
