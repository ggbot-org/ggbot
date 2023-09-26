import { BucketCannedACL, S3Client } from "@aws-sdk/client-s3"

import { AwsRegion } from "./region.js"

export type S3BucketProvider = {
	readonly region: AwsRegion
	readonly Bucket: string
	readonly client: S3Client
}

export const s3ServiceExceptionName = {
	NotFound: "NotFound",
	NoSuchKey: "NoSuchKey"
}

export const s3Client = (region: AwsRegion) =>
	new S3Client({ apiVersion: "2006-03-01", region })

// The `Bucket` and `Key` types are defined by @aws-sdk/client-s3 as `string | undefined`.
// Redefine them here, in our use case an undefined Bucket or Key does not make sense.
export type S3Path = Pick<S3BucketProvider, "Bucket"> & {
	readonly Key: string
}

/**
 * Access Control List.
 *
 * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html}
 */
export type S3BucketACL =
	| (typeof BucketCannedACL)["public_read"]
	| (typeof BucketCannedACL)["private"]
