import {
  DeleteObjectArgs,
  GetObjectArgs,
  ListObjectsArgs,
  PutObjectArgs,
  deleteObject as _deleteObject,
  getObject as _getObject,
  listObjects as _listObjects,
  putObject as _putObject,
} from "@ggbot2/aws";
import { DeletionTime, deletedNow } from "@ggbot2/models";
import { getDataBucketName } from "@ggbot2/infrastructure";

const Bucket = getDataBucketName();

type DeleteObject = (
  _: Omit<DeleteObjectArgs, "Bucket">
) => Promise<DeletionTime>;

export const deleteObject: DeleteObject = async (
  args: Omit<DeleteObjectArgs, "Bucket">
) => {
  await _deleteObject({ Bucket, ...args });
  return deletedNow();
};

export const getObject = <T>(args: Omit<GetObjectArgs, "Bucket">) =>
  _getObject<T>({ Bucket, ...args });

export const listObjects = (args: Omit<ListObjectsArgs, "Bucket">) =>
  _listObjects({ Bucket, ...args });

export const putObject = async (args: Omit<PutObjectArgs, "Bucket">) =>
  await _putObject({ Bucket, ...args });
