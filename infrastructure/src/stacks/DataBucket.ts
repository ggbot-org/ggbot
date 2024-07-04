import { S3Bucket, S3BucketACL } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"
import { getS3DataBucketName } from "@workspace/s3-data-bucket"

const awsRegion = ENV.AWS_DATA_REGION()

export class DataBucket extends S3Bucket {
	readonly ACL: S3BucketACL

	constructor() {
		super(
			awsRegion,
			getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsRegion)
		)
		this.ACL = "private"
	}

	async create() {
		await super.create(this.ACL)
	}
}
