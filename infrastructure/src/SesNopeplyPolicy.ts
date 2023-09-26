import { IamPolicy } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class SesNoreplyPolicy implements IamPolicy {
	get policyName() {
		return `${ENV.PROJECT_SHORT_NAME()}-ses-noreply-policy`
	}

	get arn() {
		return `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:policy/${this.policyName}`
	}
}
