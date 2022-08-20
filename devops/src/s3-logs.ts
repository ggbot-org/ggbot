import { getLogsBucketName, logsBucketACL } from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getLogsBucketName();
const ACL = logsBucketACL;

export const getLogsBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createLogsBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
