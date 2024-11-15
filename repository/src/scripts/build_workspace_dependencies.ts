import { exit } from 'node:process'

import { buildWorkspacesDependencies } from '../buildWorkspaceDependencies.js'

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for workspace `foo` add the following scripts.
 *
 * ```json
 * "scripts": {
 * 	"build:foo": "npm run build -w foo",
 * 	"prebuild:foo": "npm run build_workspace_dependencies -w repository foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname !== 'string') exit(1)

await buildWorkspacesDependencies(workspacePathname)
