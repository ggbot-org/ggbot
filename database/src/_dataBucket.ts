import {
  deleteObject,
  getObject,
  listObjects,
  putObject as _putObject,
  updateObject,
} from "@ggbot2/aws";
import { getDataBucketName } from "@ggbot2/infrastructure";

const Bucket = getDataBucketName();

export const READ = getObject(Bucket);

export const DELETE = deleteObject(Bucket);

export const LIST = listObjects(Bucket);

export const UPDATE = updateObject(Bucket);

export const putObject = _putObject(Bucket);
