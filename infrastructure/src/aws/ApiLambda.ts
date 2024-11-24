import { FunctionCode } from '@aws-sdk/client-lambda'
import { ENV } from '@workspace/env'

import { ApiRole } from './ApiRole.js'
import { LambdaFunction } from './LambdaFunction.js'

export class ApiLambda extends LambdaFunction {
	executionRole = new ApiRole()

	constructor(region: string, apiName: string) {
		super(ENV.AWS_ACCOUNT_ID(), region, `${ApiLambda.apiNamePrefix()}${ENV.DEPLOY_STAGE()}-api-${apiName}`)
	}

	static apiNamePrefix() {
		return `${ENV.PROJECT_SHORT_NAME()}-`
	}

	async create({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await super.create({ Role: this.executionRole.arn, ZipFile })
	}

	async update({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await super.update({ ZipFile })
	}
}

