import { deleteObject, getObject, listObjects, putObject } from "@ggbot2/aws";
import { getDataBucketName } from "@ggbot2/infrastructure";
import { deletedNow, updatedNow } from "@ggbot2/models";
import { DflowArray, DflowObject } from "dflow";

import { ErrorInvalidData } from "./errors.js";

const Bucket = getDataBucketName();

type AsyncFunction = (...arguments_: any[]) => Promise<unknown>;

export const READ = async <Operation extends AsyncFunction>(
  isData: (
    arg: unknown
  ) => arg is Exclude<Awaited<ReturnType<Operation>>, null>,
  Key: string
): Promise<Awaited<ReturnType<Operation>> | null> => {
  try {
    const json = await getObject(Bucket)(Key);
    if (!json) return null;
    const data = JSON.parse(json);
    if (isData(data)) return data;
    throw new ErrorInvalidData();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
};

export const READ_ARRAY = async <Operation extends AsyncFunction>(
  isData: (arg: unknown) => arg is Awaited<ReturnType<Operation>>,
  Key: string
): Promise<Awaited<ReturnType<Operation>>> => {
  try {
    const json = await getObject(Bucket)(Key);
    if (!json) return [] as Awaited<ReturnType<Operation>>;
    const data = JSON.parse(json);
    if (isData(data)) return data;
    throw new ErrorInvalidData();
  } catch (error) {
    if (error instanceof SyntaxError)
      return [] as Awaited<ReturnType<Operation>>;
    throw error;
  }
};

export const DELETE = async (Key: string) => {
  await deleteObject(Bucket)(Key);
  return deletedNow();
};

export const LIST = listObjects(Bucket);

export const UPDATE = async (Key: string, data: DflowArray | DflowObject) => {
  await WRITE(Key, data);
  return updatedNow();
};

export const WRITE = async (Key: string, data: DflowArray | DflowObject) => {
  const json = JSON.stringify(data);
  await putObject(Bucket)(Key, json);
};
