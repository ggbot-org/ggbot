import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { importmapConfig, nodeModulesDir, publicDir } from '../package.js'

for (const { nodeModulePath, publicModulePath } of Object.values(importmapConfig)) {
	const publicModulePathname = join(publicDir, ...publicModulePath)
	const publicModulesDir = dirname(publicModulePathname)
	// Create public module directory if it does not exist.
	if (!existsSync(publicModulesDir)) mkdirSync(publicModulesDir)
	cpSync(join(nodeModulesDir, ...nodeModulePath), join(publicDir, ...publicModulePath))
}
