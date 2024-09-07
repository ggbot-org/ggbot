import { ApiLogGroup } from "../aws/ApiLogGroup.js"

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for workspace `api-lambda-foo` add the following scripts.
 *
 * ```json
 * "scripts": {
 * 	"create_api_lambda:foo": "npm run create_api_lambda -w infrastructure api-lambda-foo",
 * 	"precreate_api_lambda:foo": "npm run build_workspace_dependencies -w repository api-lambda-foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname !== "string") process.exit(1)

// TODO the api-lambda- prefix should come from repository and a test should check
// that api lambda functions has all files and contents needed
const apiName = workspacePathname.replace("api-lambda-", "")
// TODO const apiLambda = new ApiLambda(apiName)
const logGroup = new ApiLogGroup(apiName)
await logGroup.create()

