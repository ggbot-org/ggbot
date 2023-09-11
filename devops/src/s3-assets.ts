import { assetsBucketACL, getAssetsBucketName } from "@workspace/infrastructure"

import { createS3Bucket, getS3BucketStatus, S3BucketStatus } from "./_s3.js"

const Bucket = getAssetsBucketName()
const ACL = assetsBucketACL

export const getAssetsBucketStatus = async (): Promise<S3BucketStatus> =>
	await getS3BucketStatus({ Bucket })

export const createAssetsBucket = async () =>
	await createS3Bucket({ ACL, Bucket })
