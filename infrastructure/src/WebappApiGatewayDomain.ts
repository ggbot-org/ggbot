import { ApiGatewayDomain } from "@workspace/aws-api-gateway"
import { AwsAccountId, AwsRegion } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "./awsRegions.js"

export class WebappApiGatewayDomain extends ApiGatewayDomain {
	static accountId: AwsAccountId = ENV.AWS_ACCOUNT_ID()
	static region: AwsRegion = ENV.AWS_BINANCE_PROXY_REGION()

	constructor() {
		super(
			ENV.AWS_ACCOUNT_ID(),
			staticWebsiteAwsRegion,
			`${ENV.PROJECT_SHORT_NAME()}-devops-policy`
		)
	}

	static everyArn() {
		return WebappApiGatewayDomain.arn(
			WebappApiGatewayDomain.accountId,
			WebappApiGatewayDomain.region,
			"*"
		)
	}
}
