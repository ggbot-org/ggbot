import { ENV } from "@workspace/env"
import { topLevelDomain } from "@workspace/locators"

import { awsRegion } from "./awsRegions.js"

export const getSesIdentityArn = () =>
	`arn:aws:ses:${awsRegion}:${ENV.AWS_ACCOUNT_ID()}:identity/${topLevelDomain}`
