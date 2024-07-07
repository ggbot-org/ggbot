import { AwsResource } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

export class SesIdentity implements AwsResource {
	get arn() {
		const arnPrefix = `arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity`
		return `${arnPrefix}/${ENV.DNS_DOMAIN()}`
	}
}
