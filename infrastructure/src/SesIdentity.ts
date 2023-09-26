import { AwsResource } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class SesIdentity implements AwsResource {
	get arn() {
		return `arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity/${ENV.DNS_DOMAIN()}`
	}
}
