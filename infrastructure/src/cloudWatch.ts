import { ENV } from "@workspace/env"

import { awsRegion } from "./awsRegions.js"

export const getLogsArn = () =>
	`arn:aws:logs:${awsRegion}:${ENV.AWS_ACCOUNT_ID()}:*`
