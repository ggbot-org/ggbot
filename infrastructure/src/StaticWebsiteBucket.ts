import { S3Bucket, S3BucketACL } from "@workspace/aws-s3"

export class StaticWebsiteBucket extends S3Bucket {
	readonly ACL: S3BucketACL

	constructor(region: S3Bucket["region"], name: S3Bucket["name"]) {
		super(region, name)
		this.ACL = "public-read"
	}

	async create() {
		await super.create(this.ACL)
	}
}
