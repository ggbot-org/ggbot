import {
	CreateBucketCommand,
	HeadBucketCommand,
	S3Client,
	S3ServiceException
} from "@aws-sdk/client-s3"
import { AwsResource } from "@workspace/aws-types"

import { s3Client } from "./client.js"
import { s3ServiceExceptionName } from "./errors.js"
import { S3BucketACL } from "./types.js"

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

	/** Create S3 bucket if it does not exist. */
	async create(ACL: S3BucketACL) {
		if (await this.exists()) return
		const command = new CreateBucketCommand({ Bucket: this.name, ACL })
		await this.client.send(command)
	}

	async exists() {
		try {
			const command = new HeadBucketCommand({ Bucket: this.name })
			await this.client.send(command)
			return true
		} catch (error) {
			if (error instanceof S3ServiceException)
				if (error.name === s3ServiceExceptionName.NotFound) return false
			throw error
		}
	}
}
