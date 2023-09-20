import { join } from "node:path"

import { browserBundle } from "../esbuild/browserBundle.js"
import { publicDir, webappConfig } from "../package.js"

for (const { entryPoint, jsPath } of Object.values(webappConfig))
	await browserBundle({
		entryPoints: [entryPoint],
		outfile: join(publicDir, ...jsPath)
	})
