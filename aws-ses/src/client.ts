import { SESClient } from "@aws-sdk/client-ses"
import { AwsRegion } from "@workspace/aws-types"

export function sesClient (region: AwsRegion) {
	return new SESClient({ apiVersion: "2010-12-01", region })
}
