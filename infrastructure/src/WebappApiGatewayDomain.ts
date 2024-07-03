import { ApiGatewayDomain } from "@workspace/aws-api-gateway"
import { AwsAccountId, AwsRegion } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { fqdn } from "./fqdn.js"

export class WebappApiGatewayDomain extends ApiGatewayDomain {
	static accountId: AwsAccountId = ENV.AWS_ACCOUNT_ID()
	static region: AwsRegion = ENV.AWS_BINANCE_PROXY_REGION()

	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), staticWebsiteAwsRegion, fqdn.apiDomain)
	}

	static everyArn() {
		return WebappApiGatewayDomain.arn(
			WebappApiGatewayDomain.accountId,
			WebappApiGatewayDomain.region,
			"*"
		)
	}
}
