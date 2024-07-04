import { AwsResource } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

// TODO move this to aws-ses
export class SesIdentity implements AwsResource {
	get arn() {
		return `arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity/${ENV.DNS_DOMAIN()}`
	}
}
