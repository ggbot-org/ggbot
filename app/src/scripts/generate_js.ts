import { join } from "node:path"

import { browserBundle } from "@ggbot2/esbuild"

import {
	adminEntryPoint,
	adminJs,
	landingEntryPoint,
	landingJs,
	publicDir,
	strategyEntryPoint,
	strategyJs,
	userEntryPoint,
	userJs
} from "../package.js"

const generateJsBundles = async () => {
	await browserBundle({
		entryPoints: [landingEntryPoint],
		outfile: join(publicDir, landingJs)
	})

	await browserBundle({
		entryPoints: [strategyEntryPoint],
		outfile: join(publicDir, strategyJs)
	})

	await browserBundle({
		entryPoints: [userEntryPoint],
		outfile: join(publicDir, userJs)
	})

	await browserBundle({
		entryPoints: [adminEntryPoint],
		outfile: join(publicDir, adminJs)
	})
}

generateJsBundles()
