import { LambdaFunction } from "@workspace/aws-lambda"
import { ENV } from "@workspace/env"

export class ApiLambda extends LambdaFunction {
	constructor(apiName: string) {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), ApiLambda.functionName(apiName))
	}

	static functionName(apiName: string) {
		return `${ENV.PROJECT_SHORT_NAME()}-${ENV.DEPLOY_STAGE()}-${apiName}`
	}
}
