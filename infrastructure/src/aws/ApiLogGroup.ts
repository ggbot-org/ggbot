import { LogGroup } from "@workspace/aws-logs"
import { ENV } from "@workspace/env"

import { ApiLambda } from "./ApiLambda.js"

export class ApiLogGroup extends LogGroup {
	constructor(apiName: string) {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), ApiLogGroup.logGroupName(apiName))
	}

	static logGroupName(apiName: string) {
		return `/aws/lambda/${ApiLambda.functionName(apiName)}`
	}

	async create () {
		await super.create("STANDARD")
	}
}
