import { ENV } from "@workspace/env"

import { awsRegion } from "./awsRegions.js"

export const getSesIdentityArn = () =>
	`arn:aws:ses:${awsRegion}:${ENV.AWS_ACCOUNT_ID()}:identity/${ENV.DNS_DOMAIN()}`
