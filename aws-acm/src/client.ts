import { ACMClient } from "@aws-sdk/client-acm"
import { AwsRegion } from "@workspace/aws-types"

export const acmClient = (region: AwsRegion) =>
	new ACMClient({ apiVersion: "2015-12-08", region })
