import { exit } from 'node:process'

import { prepareApi } from '../aws/prepareApi.js'

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for API workspace `api-foo` add the following script.
 *
 * ```json
 * "scripts": {
 * 	"deploy:api:foo": "npm run deploy_api -w infrastructure api-foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname != 'string') exit(1)

await prepareApi(workspacePathname)
