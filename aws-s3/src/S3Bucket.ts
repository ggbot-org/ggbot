import { S3Client } from "@aws-sdk/client-s3"
import { AwsRegion, AwsResource } from "@workspace/aws-types"

import { s3Client } from "./client.js"

export class S3Bucket implements AwsResource {
	readonly name: string
	readonly region: AwsRegion
	readonly client: S3Client

	constructor(region: AwsRegion, name: string) {
		this.region = region
		this.name = name
		this.client = s3Client(region)
	}

	get arn() {
		return `arn:aws:s3:::${this.name}`
	}
}
