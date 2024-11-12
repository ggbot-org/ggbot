import { ENV } from "@workspace/env"

import { ApiRole } from "./ApiRole.js"
import { LambdaFunction } from "./LambdaFunction.js"

export class ApiLambda extends LambdaFunction {
	apiName: string

	constructor(apiName: string) {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-${ENV.DEPLOY_STAGE()}-${apiName}`)
		this.executionRoleArn = new ApiRole().arn
		this.apiName = apiName
	}
}
