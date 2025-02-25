import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { importmapConfig, nodeModulesDir, publicDir } from '../package.js'

for (const {
	sourceDir,
	sourceFile,
	sourceMap,
	targetDir,
	targetFile,
} of Object.values(importmapConfig)) {
	const sourceModuleDir = join(nodeModulesDir, ...sourceDir)
	const publicModuleDir = join(publicDir, ...targetDir)
	// Create public module directory if it does not exist.
	targetDir
		.map((_, index, array) => join(publicDir, ...array.slice(0, index + 1)))
		.forEach((dir) => {
			if (!existsSync(dir)) mkdirSync(dir)
		})
	// Copy module file.
	cpSync(join(sourceModuleDir, sourceFile), join(publicModuleDir, targetFile))
	// Copy source map, if any.
	if (sourceMap)
		cpSync(join(sourceModuleDir, sourceMap), join(publicModuleDir, sourceMap))
}
