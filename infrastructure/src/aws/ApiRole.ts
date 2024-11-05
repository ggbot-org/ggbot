import { ENV } from "@workspace/env"

export class ApiRole {
	get arn() {
		const arnPrefix = `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:role`
		return `${arnPrefix}/${ENV.PROJECT_SHORT_NAME()}-api-role`
	}
}
