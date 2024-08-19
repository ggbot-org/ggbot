import { S3Client } from "@aws-sdk/client-s3"
import { AwsRegion } from "@workspace/aws-types"

export function s3Client(region: AwsRegion){
	return new S3Client({ apiVersion: "2006-03-01", region })
}
