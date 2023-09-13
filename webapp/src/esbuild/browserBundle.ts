import { ENV } from "@workspace/env"
import { build, BuildOptions } from "esbuild"

import { esbuildDefinitions } from "./definitions.js"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()

/**
 * Generate bundle for web apps.
 *
 * @example
 *
 * ```ts
 * import { browserBundle } from "@workspace/esbuild"
 *
 * const bundleWebApps = async () => {
 * 	await browserBundle({
 * 		entryPoints: ["src/app.tsx"],
 * 		outfile: "public/app"
 * 	})
 * }
 *
 * bundleWebApps()
 * ```
 */

export const browserBundle = async ({
	entryPoints,
	outfile
}: Pick<BuildOptions, "entryPoints" | "outfile">) => {
	build({
		alias: {
			"@formatjs/icu-messageformat-parser":
				"@formatjs/icu-messageformat-parser/no-parser"
		},
		bundle: true,
		define: esbuildDefinitions,
		entryPoints,
		minify: DEPLOY_STAGE !== "local",
		outfile,
		platform: "browser"
	})
}
