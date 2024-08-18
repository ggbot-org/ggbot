import { S3Client } from "@aws-sdk/client-s3"
import { AwsResource } from "@workspace/aws-types"

import { s3Client } from "./client.js"

export class S3Bucket implements AwsResource {
	readonly name: string
	readonly region: string
	readonly client: S3Client

	constructor(region: S3Bucket["region"], name: S3Bucket["name"]) {
		this.region = region
		this.name = name
		this.client = s3Client(region)
	}

	get arn() {
		return `arn:aws:s3:::${this.name}`
	}
}
