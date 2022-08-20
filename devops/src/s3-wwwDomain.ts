import {
  getWwwDomainBucketName,
  wwwDomainBucketACL,
} from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getWwwDomainBucketName();
const ACL = wwwDomainBucketACL;

export const getWwwDomainBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createWwwDomainBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
