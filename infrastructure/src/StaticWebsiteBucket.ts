import { S3Bucket, S3BucketACL } from "./S3Bucket.js"

export class StaticWebsiteBucket extends S3Bucket {
	readonly acl: S3BucketACL

	constructor(name: S3Bucket["name"]) {
		super(name)
		this.acl = "public-read"
	}
}
