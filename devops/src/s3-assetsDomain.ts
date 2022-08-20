import {
  getAssetsDomainBucketName,
  assetsDomainBucketACL,
} from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getAssetsDomainBucketName();
const ACL = assetsDomainBucketACL;

export const getAssetsDomainBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createAssetsDomainBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
