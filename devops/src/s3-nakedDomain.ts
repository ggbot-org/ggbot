import {
  getNakedDomainBucketName,
  nakedDomainBucketACL,
} from "@ggbot2/infrastructure";
import { S3BucketStatus, createS3Bucket, getS3BucketStatus } from "./_s3.js";

const Bucket = getNakedDomainBucketName();
const ACL = nakedDomainBucketACL;

export const getNakedDomainBucketStatus = async (): Promise<S3BucketStatus> =>
  await getS3BucketStatus({ Bucket });

export const createNakedDomainBucket = async () =>
  await createS3Bucket({ ACL, Bucket });
