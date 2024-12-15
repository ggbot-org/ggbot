import { readFile } from 'node:fs/promises'
import { exit } from 'node:process'

import { prepareApi } from '@workspace/repository'

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
 * 	"create:api:foo": "npm run deploy_api -w infrastructure api-foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname != 'string') exit(1)

const apiLamda = instantiateApiLambda(workspacePathname)

// Create Lambda function.

const lambdaZipFilename = await prepareApi(workspacePathname)

console.info(`Create ${workspacePathname} Lambda function with zip file ${lambdaZipFilename}`)

const ZipFile = await readFile(lambdaZipFilename)

await apiLamda.create({ ZipFile })

await apiLamda.createLogGroup()
