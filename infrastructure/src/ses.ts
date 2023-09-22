import { ENV } from "@workspace/env"

export const getSesIdentityArn = () =>
	`arn:aws:ses:${ENV.AWS_SES_REGION()}:${ENV.AWS_ACCOUNT_ID()}:identity/${ENV.DNS_DOMAIN()}`
