import { S3Bucket, S3BucketACL } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"
import { getS3DataBucketName } from "@workspace/s3-data-bucket"

const AWS_REGION = ENV.AWS_DATA_REGION()

export class DataBucket extends S3Bucket {
	readonly ACL: S3BucketACL = "private"

	constructor() {
		super(
			AWS_REGION,
			getS3DataBucketName(
				ENV.DEPLOY_STAGE(),
				ENV.DNS_DOMAIN(),
				AWS_REGION
			)
		)
	}

	async create() {
		await super.create(this.ACL)
	}
}
