import {
  S3ServiceException,
  headBucket,
  s3ServiceExceptionName,
} from "@ggbot2/aws";
import { dataBucketName } from "@ggbot2/infrastructure";

const Bucket = dataBucketName();
export const dataBucket = Bucket;

export const dataBucketExists = async () => {
  try {
    await headBucket({ Bucket });
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException)
      if (error.name === s3ServiceExceptionName.NotFound) return false;
    throw error;
  }
};

export type DataBucketStatus = {
  exists: boolean;
};

export const getDataBucketStatus = async () => {
  const exists = await dataBucketExists();

  return { exists };
};
