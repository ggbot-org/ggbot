import { S3Bucket, S3BucketACL } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"

import { fqdn } from "./fqdn.js"

export class StaticWebsiteBucket extends S3Bucket {
	readonly ACL: S3BucketACL = "public-read"

	constructor() {
		super(ENV.AWS_DATA_REGION(), fqdn.webappDomain)
	}

	async create() {
		await super.create(this.ACL)
	}
}
