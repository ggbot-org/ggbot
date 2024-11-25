import { ENV } from '@workspace/env'
import { build, BuildOptions } from 'esbuild'

import { esbuildDefinitions } from './definitions.js'

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()

/**
 * Generate JS bundle for a web app.
 *
 * @example
 *
 * ```ts
 * import { browserBundle } from "@workspace/esbuild"
 *
 * await browserBundle({
 * 	entryPoints: ["src/app.tsx"],
 * 	outfile: "public/app.js"
 * })
 * ```
 */

export function browserBundle({
	entryPoints,
	outfile
}: Pick<BuildOptions, 'entryPoints' | 'outfile'>) {
	return build({
		alias: {
			'react': 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat',
			'react/jsx-runtime': 'preact/jsx-runtime',
			// TODO remove this, not using formatjs anymore
			// `react-intl` without the parser is 40% smaller,
			// see https://formatjs.io/docs/guides/advanced-usage/
			'@formatjs/icu-messageformat-parser':
				'@formatjs/icu-messageformat-parser/no-parser'
		},
		bundle: true,
		define: esbuildDefinitions,
		entryPoints,
		legalComments: 'none',
		minify: DEPLOY_STAGE !== 'local',
		outfile,
		platform: 'browser'
	})
}
