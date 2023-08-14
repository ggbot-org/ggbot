import { deleteObject, getObject, listObjects, putObject } from "@ggbot2/aws";
import { ENV } from "@ggbot2/env";
import { getDataBucketName } from "@ggbot2/infrastructure";
import { deletedNow, updatedNow } from "@ggbot2/models";
import { DflowArray, DflowObject } from "dflow";

import { ErrorInvalidData } from "./errors.js";

const isDev = ENV.DEPLOY_STAGE() !== "main";

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
    if (!json) {
      if (isDev) console.info("READ", Key, "null");
      return null;
    }
    const data = JSON.parse(json);
    if (isDev) console.info("READ", Key, `isData=${isData(data)}`, data);
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
    if (!json) {
      if (isDev) console.info("READ_ARRAY", Key, "[]");
      return [] as Awaited<ReturnType<Operation>>;
    }
    const data = JSON.parse(json);
    if (isDev) console.info("READ_ARRAY", Key, `isData=${isData(data)}`, data);
    if (isData(data)) return data;
    throw new ErrorInvalidData();
  } catch (error) {
    if (error instanceof SyntaxError)
      return [] as Awaited<ReturnType<Operation>>;
    throw error;
  }
};

export const DELETE = async (Key: string) => {
  if (isDev) console.info("DELETE", Key);
  await deleteObject(Bucket)(Key);
  return deletedNow();
};

export const LIST = listObjects(Bucket);

export const UPDATE = async (Key: string, data: DflowArray | DflowObject) => {
  await WRITE(Key, data);
  return updatedNow();
};

export const WRITE = async (Key: string, data: DflowArray | DflowObject) => {
  if (isDev) console.info("WRITE", Key, data);
  const json = JSON.stringify(data);
  await putObject(Bucket)(Key, json);
};
