import { S3Client } from "@aws-sdk/client-s3"
import { AwsRegion } from "@workspace/aws-types"

export type S3BucketProvider = {
	readonly region: AwsRegion
	readonly Bucket: string
	readonly client: S3Client
}

// The `Bucket` and `Key` types are defined by @aws-sdk/client-s3 as `string | undefined`.
// Redefine them here, in our use case an undefined Bucket or Key does not make sense.
export type S3Path = Pick<S3BucketProvider, "Bucket"> & {
	readonly Key: string
}
