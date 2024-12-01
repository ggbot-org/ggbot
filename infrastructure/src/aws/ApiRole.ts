import { ENV } from '@workspace/env'

export class ApiRole {
	get arn() {
		return `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:role/${ENV.PROJECT_SHORT_NAME()}-api-role`
	}
}
