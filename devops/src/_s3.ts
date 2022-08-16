import {
  CreateBucketArgs,
  HeadBucketArgs,
  S3ServiceException,
  createBucket,
  headBucket,
} from "@ggbot2/aws";

export type S3BucketStatus = {
  name: string;
  exists: boolean;
};

export const s3BucketExists = async (args: HeadBucketArgs) => {
  try {
    await headBucket(args);
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException)
      if (error.name === "NotFound") return false;

    throw error;
  }
};

type CreateS3BucketArgs = CreateBucketArgs;

export const createS3Bucket = async (
  args: CreateS3BucketArgs
): Promise<void> => {
  const { Bucket } = args;
  const exists = await s3BucketExists({ Bucket });
  if (exists) return;
  await createBucket(args);
};

type GetS3BucketStatusArgs = HeadBucketArgs;

export const getS3BucketStatus = async ({
  Bucket,
}: GetS3BucketStatusArgs): Promise<S3BucketStatus> => {
  const exists = await s3BucketExists({ Bucket });
  if (!exists) return { exists, name: Bucket };

  return { exists, name: Bucket };
};
