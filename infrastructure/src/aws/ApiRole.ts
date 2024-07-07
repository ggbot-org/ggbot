import { AwsResource } from "@workspace/aws-types"
import { ENV } from "@workspace/env"

const AWS_ACCOUNT_ID = ENV.AWS_ACCOUNT_ID()

export class ApiRole implements AwsResource {
	static arnPrefix = `arn:aws:iam::${AWS_ACCOUNT_ID}:role`

	get arn() {
		// TODO use another name, not ggbot2_api_role
		return `arn:aws:iam::${AWS_ACCOUNT_ID}:role/ggbot2_api_role`
	}
}
