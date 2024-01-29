import { join } from "node:path"

import { browserBundle } from "_/esbuild/browserBundle"
import { publicDir, webappEcmaScriptsConfig } from "_/package"

for (const { entryPoint, jsPath } of Object.values(webappEcmaScriptsConfig))
	await browserBundle({
		entryPoints: [entryPoint],
		outfile: join(publicDir, ...jsPath)
	})
