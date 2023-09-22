import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "./awsRegions.js"

export const getLogsArn = () =>
	`arn:aws:logs:${staticWebsiteAwsRegion}:${ENV.AWS_ACCOUNT_ID()}:*`
