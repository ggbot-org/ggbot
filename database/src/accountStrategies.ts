import {
  CreateAccountStrategiesItemScheduling,
  DeleteAccountStrategiesItem,
  InsertAccountStrategiesItem,
  ReadAccountStrategies,
  RemoveAccountStrategiesItemSchedulings,
  UpdateAccountStrategiesItem,
  deletedNow,
  createdNow,
  updatedNow,
  newStrategyScheduling,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readAccountStrategies: ReadAccountStrategies["func"] = async (
  key
) =>
  await getObject<ReadAccountStrategies["out"]>({
    Key: pathname.accountStrategies(key),
  });

export const insertAccountStrategiesItem: InsertAccountStrategiesItem["func"] =
  async ({ accountId, item }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = [...items, item];
    const Key = pathname.accountStrategies({ accountId });
    await putObject({ Key, data });
    return createdNow();
  };

export const updateAccountStrategiesItem: UpdateAccountStrategiesItem["func"] =
  async ({ accountId, strategyId, changes }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return { ...item, ...changes };
    });
    const Key = pathname.accountStrategies({ accountId });
    await putObject({ Key, data });
    return updatedNow();
  };

export const createAccountStrategiesItemScheduling: CreateAccountStrategiesItemScheduling["func"] =
  async ({ accountId, strategyId, frequency }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return {
        ...item,
        schedulings: item.schedulings.concat(
          newStrategyScheduling({ frequency })
        ),
      };
    });
    const Key = pathname.accountStrategies({ accountId });
    await putObject({ Key, data });
    return updatedNow();
  };

export const removeAccountStrategiesItemSchedulings: RemoveAccountStrategiesItemSchedulings["func"] =
  async ({ accountId, strategyId }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return {
        ...item,
        schedulings: [],
      };
    });
    const Key = pathname.accountStrategies({ accountId });
    await putObject({ Key, data });
    return updatedNow();
  };

export const deleteAccountStrategiesItem: DeleteAccountStrategiesItem["func"] =
  async ({ accountId, strategyId }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.filter((item) => item.strategyId !== strategyId);
    if (data.length !== items.length) {
      const Key = pathname.accountStrategies({ accountId });
      await putObject({ Key, data });
    }
    return deletedNow();
  };
