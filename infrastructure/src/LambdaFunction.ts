import { AwsResource } from "@workspace/aws"
import { ENV } from "@workspace/env"

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

	static namespacedFunctionName(functionName: string) {
		return `${ENV.PROJECT_SHORT_NAME()}-${functionName}`
	}
}
