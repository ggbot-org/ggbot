import { getDataBucketName, dataBucketACL } from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getDataBucketName();
const ACL = dataBucketACL;

export const getDataBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createDataBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
