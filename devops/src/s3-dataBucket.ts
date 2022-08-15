import { getDataBucketName } from "@ggbot2/infrastructure";
import { S3BucketStatus, getS3BucketStatus } from "./_s3.js";

export const dataBucketName = getDataBucketName();

export const getDataBucketStatus = async (): Promise<S3BucketStatus> => {
  return await getS3BucketStatus({ Bucket: dataBucketName });
};
