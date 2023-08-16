import { join } from "node:path"

import { browserBundle } from "@ggbot2/esbuild"

import { indexHtmlAppJs, indexHtmlEntryPoint, publicDir } from "../package.js"

const generateJsBundles = async () => {
	await browserBundle({
		entryPoints: [indexHtmlEntryPoint],
		outfile: join(publicDir, indexHtmlAppJs)
	})
}

generateJsBundles()
