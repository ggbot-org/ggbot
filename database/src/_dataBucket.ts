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
import { getDataBucketName } from "@ggbot2/infrastructure";

const Bucket = getDataBucketName();

export const deleteObject = (args: Omit<DeleteObjectArgs, "Bucket">) =>
  _deleteObject({ Bucket, ...args });

export const getObject = (args: Omit<GetObjectArgs, "Bucket">) =>
  _getObject({ Bucket, ...args });

export const listObjects = (args: Omit<ListObjectsArgs, "Bucket">) =>
  _listObjects({ Bucket, ...args });

export const putObject = (args: Omit<PutObjectArgs, "Bucket">) =>
  _putObject({ Bucket, ...args });
