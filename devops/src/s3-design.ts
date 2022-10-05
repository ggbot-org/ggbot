import { getDesignBucketName, designBucketACL } from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getDesignBucketName();
const ACL = designBucketACL;

export const geDesignBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createDesignBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
