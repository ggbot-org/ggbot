import { FunctionCode } from '@aws-sdk/client-lambda'
import { ENV } from '@workspace/env'

import { ApiRole } from './ApiRole.js'
import { LambdaFunction } from './LambdaFunction.js'
import { LogGroup } from './LogGroup.js'

export class ApiLambda extends LambdaFunction {
	executionRole = new ApiRole()

	constructor(
		region: string,
		/** @remarks The API workspacePathname starts with `api-` prefix. */
		workspacePathname: string
	) {
		super(region, `${ApiLambda.apiNamePrefix()}${ENV.DEPLOY_STAGE()}-${workspacePathname}`)
	}

	static apiNamePrefix() {
		return `${ENV.PROJECT_SHORT_NAME()}-`
	}

	static commonEnvironmentVariables() {
		return {
			AWS_ACCOUNT_ID: ENV.AWS_ACCOUNT_ID(),
			DEPLOY_STAGE: ENV.DEPLOY_STAGE(),
			DNS_DOMAIN: ENV.DNS_DOMAIN(),
		}
	}

	async create({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await super.create({ Role: this.executionRole.arn, ZipFile })
	}

	async createLogGroup() {
		const logGroup = new LogGroup(this.region, `/aws/lambda/${this.functionName}`)
		await logGroup.create()
	}
}

