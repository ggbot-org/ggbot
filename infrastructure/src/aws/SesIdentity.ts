import { ENV } from '@workspace/env'

export class SesIdentity {
	get arn() {
		return `arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity/${ENV.DNS_DOMAIN()}`
	}
}
