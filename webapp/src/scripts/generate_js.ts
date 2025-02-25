import { join } from 'node:path'

import { browserBundle } from '../esbuild/browserBundle.js'
import { publicDir, webappEcmaScriptsConfig } from '../package.js'

for (const { entryPoint, jsPath } of Object.values(webappEcmaScriptsConfig))
	await browserBundle({
		entryPoints: [entryPoint],
		outfile: join(publicDir, ...jsPath),
	})
