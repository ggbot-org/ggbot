import { exit } from 'node:process'

import { instantiateApiLambda } from '../aws/apiLambdas.js'

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for API workspace `api-foo` add the following script.
 *
 * ```json
 * "scripts": {
 * 	"set_environment:api-foo": "npm run set_api_environment -w infrastructure api-foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname != 'string') exit(1)

const apiLamda = instantiateApiLambda(workspacePathname)

await apiLamda.setEnvironment()
