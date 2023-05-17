import {
  createBucket,
  CreateBucketArgs,
  headBucket,
  HeadBucketArgs,
  S3ServiceException,
  s3ServiceExceptionName,
} from "@ggbot2/aws";

import { CreateOutput } from "./_create.js";

export type S3BucketStatus = {
  exists: boolean;
};

export const s3BucketExists = async (args: HeadBucketArgs) => {
  try {
    await headBucket(args);
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === s3ServiceExceptionName.NotFound) return false;
    }
    console.error(`s3BucketExists Bucket=${args.Bucket}`);
    throw error;
  }
};

type CreateS3BucketArgs = CreateBucketArgs;
export type CreateS3BucketOutput = CreateOutput & { name: string };

export const createS3Bucket = async (
  args: CreateS3BucketArgs
): Promise<CreateS3BucketOutput> => {
  const { Bucket } = args;
  const exists = await s3BucketExists({ Bucket });
  if (exists) return { exists: true, created: false, name: Bucket };
  await createBucket(args);
  return { exists: false, created: true, name: Bucket };
};

type GetS3BucketStatusArgs = HeadBucketArgs;

export const getS3BucketStatus = async ({
  Bucket,
}: GetS3BucketStatusArgs): Promise<S3BucketStatus> => {
  const exists = await s3BucketExists({ Bucket });
  if (!exists) return { exists };

  return { exists };
};
