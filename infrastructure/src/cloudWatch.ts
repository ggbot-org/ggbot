import { ENV } from "@ggbot2/env"

import { awsRegion } from "./awsRegions.js"

export const getLogsArn = () =>
	`arn:aws:logs:${awsRegion}:${ENV.AWS_ACCOUNT_ID()}:*`
