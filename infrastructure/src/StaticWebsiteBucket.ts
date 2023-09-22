import { S3Bucket, S3BucketACL } from "@workspace/aws"

export class StaticWebsiteBucket extends S3Bucket {
	readonly ACL: S3BucketACL

	constructor(region: S3Bucket["region"], name: S3Bucket["name"]) {
		super(region, name)
		this.ACL = "public-read"
	}

	async createIfItDoesExist() {
		await super.create(this.ACL)
	}
}
