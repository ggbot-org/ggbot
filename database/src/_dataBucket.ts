import {
  deleteObject as _deleteObject,
  DeleteObjectArgs,
  getObject as _getObject,
  GetObjectArgs,
  listObjects as _listObjects,
  ListObjectsArgs,
  putObject as _putObject,
  PutObjectArgs,
} from "@ggbot2/aws";
import { getDataBucketName } from "@ggbot2/infrastructure";
import { deletedNow, DeletionTime } from "@ggbot2/models";

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
