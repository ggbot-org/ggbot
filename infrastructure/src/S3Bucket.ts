import { BucketCannedACL } from "@aws-sdk/client-s3"
import {
	headBucket,
	S3ServiceException,
	s3ServiceExceptionName
} from "@workspace/aws"

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

	constructor(name: S3Bucket["name"]) {
		this.name = name
	}

	get arn() {
		return `arn:aws:s3:::${this.name}`
	}

	async exists() {
		try {
			await headBucket({ Bucket: this.name })
			return true
		} catch (error) {
			if (error instanceof S3ServiceException)
				if (error.name === s3ServiceExceptionName.NotFound) return false
			throw error
		}
	}
}
