import { S3Client } from "@aws-sdk/client-s3"

export function s3Client(region: string){
	return new S3Client({ apiVersion: "2006-03-01", region })
}
