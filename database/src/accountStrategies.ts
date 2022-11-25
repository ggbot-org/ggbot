import {
  ReadAccountStrategies,
  WriteAccountStrategies,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readAccountStrategies: ReadAccountStrategies["func"] = async (
  key
) =>
  await getObject<ReadAccountStrategies["out"]>({
    Key: pathname.accountStrategies(key),
  });

export const writeAccountStrategies: WriteAccountStrategies["func"] = async ({
  accountId,
  strategies,
}) => {
  const Key = pathname.accountStrategies({ accountId });
  await putObject({ Key, data: strategies });
  return updatedNow();
};
