import { ENV } from "@workspace/env"

export class SesIdentity {
	get arn() {
		const arnPrefix = `arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity`
		return `${arnPrefix}/${ENV.DNS_DOMAIN()}`
	}
}
