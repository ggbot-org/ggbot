import { S3Client } from "@aws-sdk/client-s3"

import { s3Client } from "./client.js"

export class S3Bucket {
	readonly name: string
	readonly region: string
	readonly client: S3Client

	constructor(region: string, name: string) {
		this.region = region
		this.name = name
		this.client = s3Client(region)
	}

	get arn() {
		return `arn:aws:s3:::${this.name}`
	}
}
