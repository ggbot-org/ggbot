import { SESClient } from "@aws-sdk/client-ses"
import { AwsRegion } from "@workspace/aws-types"

export const sesClient = (region: AwsRegion) =>
	new SESClient({ apiVersion: "2010-12-01", region })
