import {
	BucketCannedACL,
	createBucket,
	CreateBucketArgs,
	headBucket,
	S3ServiceException,
	s3ServiceExceptionName
} from "@workspace/aws"

import { AwsRegion } from "./awsRegions.js"

/**
 * Access Control List.
 *
 * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html}
 */
export type S3BucketACL =
	| (typeof BucketCannedACL)["public_read"]
	| (typeof BucketCannedACL)["private"]

export class S3Bucket {
	name: string
	region: AwsRegion

	constructor(region: S3Bucket["region"], name: S3Bucket["name"]) {
		this.name = name
		this.region = region
	}

	get arn() {
		return `arn:aws:s3:::${this.name}`
	}

	async createIfItDoesExist(args: Pick<CreateBucketArgs, "ACL">) {
		if (await this.exists()) return
		await createBucket({ Bucket: this.name, region: this.region, ...args })
	}

	async exists() {
		try {
			await headBucket({ Bucket: this.name, region: this.region })
			return true
		} catch (error) {
			if (error instanceof S3ServiceException)
				if (error.name === s3ServiceExceptionName.NotFound) return false
			throw error
		}
	}
}
