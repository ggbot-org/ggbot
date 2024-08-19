import { EC2Client } from "@aws-sdk/client-ec2"
import { AwsRegion } from "@workspace/aws-types"

export function ec2Client (region: AwsRegion) {
	return new EC2Client({ apiVersion: "2010-12-01", region })
}
