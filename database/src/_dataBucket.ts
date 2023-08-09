import { deleteObject, getObject, listObjects, putObject } from "@ggbot2/aws";
import { getDataBucketName } from "@ggbot2/infrastructure";

const Bucket = getDataBucketName();

export const DELETE = deleteObject(Bucket);

export const GET = getObject(Bucket);

export const LIST = listObjects(Bucket);

export const PUT = putObject(Bucket);
