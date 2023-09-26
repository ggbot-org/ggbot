import { AwsResource } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class IamDevopsPolicy implements AwsResource {
	get policyName() {
		return `${ENV.PROJECT_SHORT_NAME()}-devops-policy`
	}

	get arn() {
		return `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:policy/${this.policyName}`
	}
}
