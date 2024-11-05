import { EC2Client } from "@aws-sdk/client-ec2"

export function ec2Client (region: string) {
	return new EC2Client({ apiVersion: "2010-12-01", region })
}
