import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { webappDirname } from '@workspace/locators'
import readFile from 'read-file-utf8'

import { workerScriptPath } from './workers.js'

/** @type {import('./package').workspaceDir} */
export const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

/** @type {import('./package').monorepoDir} */
export const monorepoDir = dirname(workspaceDir)

/** @type {import('./package').nodeModulesDir} */
export const nodeModulesDir = join(monorepoDir, 'node_modules')

/** @type {import('./package').publicDir} */
export const publicDir = join(workspaceDir, 'public')

const publicModuleDirname = 'modules'

const srcDir = join(workspaceDir, 'src')

export const typesDir = join(srcDir, 'types')

/**
 * @typedef {object} PackageJson
 * @prop {Record<string, string>} dependencies
 */

/** @type {PackageJson} */
const pkg = await readFile(join(workspaceDir, 'package.json'))

const preactVersion = pkg.dependencies.preact
const preactPublicDir = [publicModuleDirname, `preact-${preactVersion}`]

/** @param {string} filename */
function routingFile(filename) {
	return join(srcDir, 'routing', filename)
}

/** @type {import('./package').importmapConfig} */
export const importmapConfig = {
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

/** @type {import('./package').webappEcmaScriptsConfig} */
export const webappEcmaScriptsConfig = {
	landing: {
		entryPoint: routingFile('RouterLanding.tsx'),
		jsPath: ['landing.js'],
	},
	strategy: {
		entryPoint: routingFile('RouterSharedStrategy.tsx'),
		jsPath: ['strategy.js'],
	},
	user: {
		entryPoint: routingFile('RouterUser.tsx'),
		jsPath: [webappDirname.user, 'app.js'],
	},
	admin: {
		entryPoint: routingFile('RouterAdmin.tsx'),
		jsPath: [webappDirname.admin, 'app.js'],
	},
	design: {
		entryPoint: routingFile('RouterDesign.tsx'),
		jsPath: [webappDirname.design, 'app.js'],
	},
	backtesting: {
		entryPoint: join(monorepoDir, 'backtesting-webworker', 'src/index.ts'),
		jsPath: workerScriptPath.backtesting,
	}
}
