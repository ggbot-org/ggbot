import { AwsResource } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

// TODO generalize it and move it to aws workspace (without specific ENV stuff)
// so it could be imported also by public-api, user-api, etc. deploy script
export class LambdaFunction implements AwsResource {
	static arnPrefix = "arn:aws:lambda:*:*:function"

	functionName: string

	constructor(functionName: string) {
		this.functionName = functionName
	}

	get arn() {
		return `${LambdaFunction.arn(this.functionName)}`
	}

	static arn(functionName: string) {
		return `${
			LambdaFunction.arnPrefix
		}:${LambdaFunction.namespacedFunctionName(functionName)}`
	}

	static everyArn() {
		return LambdaFunction.arn("*")
	}

	static namespacedFunctionName(functionName: string) {
		return `${ENV.PROJECT_SHORT_NAME()}-${functionName}`
	}
}
