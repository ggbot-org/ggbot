import { getWebappBucketName, webappBucketACL } from "@workspace/infrastructure"

import { createS3Bucket, getS3BucketStatus, S3BucketStatus } from "./_s3.js"

const Bucket = getWebappBucketName()
const ACL = webappBucketACL

export const getWebappBucketStatus = async (): Promise<S3BucketStatus> =>
	await getS3BucketStatus({ Bucket })

export const createWebappBucket = async () =>
	await createS3Bucket({ ACL, Bucket })
