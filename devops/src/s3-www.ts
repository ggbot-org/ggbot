import { getWwwBucketName, wwwBucketACL } from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getWwwBucketName();
const ACL = wwwBucketACL;

export const getWwwBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createWwwBucket = async () =>
  await createS3Bucket({ ACL, Bucket });