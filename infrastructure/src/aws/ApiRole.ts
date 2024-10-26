import { AwsResource } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

export class ApiRole implements AwsResource {
	get arn() {
		const arnPrefix = `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:role`
		return `${arnPrefix}/${ENV.PROJECT_SHORT_NAME()}-api-role`
	}
}
