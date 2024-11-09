import { S3Client } from "@aws-sdk/client-s3"

export type S3BucketProvider = {
	region: string
	Bucket: string
	client: S3Client
}

// The `Bucket` and `Key` types are defined by @aws-sdk/client-s3 as `string | undefined`.
// Redefine them here, in our use case an undefined Bucket or Key does not make sense.
export type S3Path = Pick<S3BucketProvider, "Bucket"> & {
	Key: string
}
