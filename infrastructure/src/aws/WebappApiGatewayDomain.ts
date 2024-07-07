import { ApiGatewayDomain } from "@workspace/aws-api-gateway"
import { ENV } from "@workspace/env"

import { fqdn } from "./fqdn.js"

export class WebappApiGatewayDomain extends ApiGatewayDomain {
	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), fqdn.apiDomain)
	}
}
