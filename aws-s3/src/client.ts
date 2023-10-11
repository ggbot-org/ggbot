import { S3Client } from "@aws-sdk/client-s3"
import { AwsRegion } from "@workspace/aws-types"

export const s3Client = (region: AwsRegion) =>
	new S3Client({ apiVersion: "2006-03-01", region })
