import { S3Bucket, S3BucketACL } from "@workspace/aws"

export class DataBucket extends S3Bucket {
	readonly ACL: S3BucketACL

	constructor(region: S3Bucket["region"], name: S3Bucket["name"]) {
		super(region, name)
		this.ACL = "private"
	}

	async create() {
		await super.create(this.ACL)
	}
}
