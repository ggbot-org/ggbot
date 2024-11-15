import { FunctionCode } from '@aws-sdk/client-lambda'
import { ENV } from '@workspace/env'

import { ApiRole } from './ApiRole.js'
import { LambdaFunction } from './LambdaFunction.js'

export class ApiLambda extends LambdaFunction {
	executionRole = new ApiRole()

	constructor(region: string, apiName: string) {
		super(ENV.AWS_ACCOUNT_ID(), region, `${ENV.DEPLOY_STAGE()}-api-${apiName}`)
	}

	async create({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await super.create({ Role: this.executionRole.arn, ZipFile })
	}
}

export class ApiLambdaPublic extends ApiLambda {
	constructor() {
		super(ENV.AWS_DATA_REGION(), 'public')
	}
}

export class ApiLambdaUser extends ApiLambda {
	constructor() {
		super(ENV.AWS_DATA_REGION(), 'user')
	}
}
