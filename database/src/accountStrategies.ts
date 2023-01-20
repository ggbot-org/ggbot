import {
  CreateAccountStrategiesItemScheduling,
  DeleteAccountStrategiesItem,
  InsertAccountStrategiesItem,
  ReadAccountStrategies,
  RemoveAccountStrategiesItemSchedulings,
  SuspendAccountStrategiesSchedulings,
  UpdateAccountStrategiesItem,
  createdNow,
  deletedNow,
  newStrategyScheduling,
  quota,
  updatedNow,
} from "@ggbot2/models";
import { ErrorExceededQuota } from "./errors.js";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { readSubscriptionPlan } from "./subscription.js";

export const readAccountStrategies: ReadAccountStrategies["func"] = async (
  key
) =>
  await getObject<ReadAccountStrategies["out"]>({
    Key: pathname.accountStrategies(key),
  });

export const insertAccountStrategiesItem: InsertAccountStrategiesItem["func"] =
  async ({ accountId, item }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const subscriptionPlan = await readSubscriptionPlan({ accountId });
    const numMaxStrategies = quota.MAX_STRATEGIES_PER_ACCOUNT(subscriptionPlan);
    if (items.length >= numMaxStrategies)
      throw new ErrorExceededQuota({ type: "MAX_STRATEGIES_PER_ACCOUNT" });
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
    const subscriptionPlan = await readSubscriptionPlan({ accountId });
    const numMaxSchedulings =
      quota.MAX_SCHEDULINGS_PER_ACCOUNT(subscriptionPlan);
    const numSchedulings = items.reduce<number>(
      (count, { schedulings = [] }) => {
        const numActiveSchedulings = schedulings.filter(
          ({ status }) => status === "active"
        ).length;
        return count + numActiveSchedulings;
      },
      0
    );
    if (numSchedulings >= numMaxSchedulings)
      throw new ErrorExceededQuota({ type: "MAX_SCHEDULINGS_PER_ACCOUNT" });
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

export const suspendAccountStrategiesSchedulings: SuspendAccountStrategiesSchedulings["func"] =
  async ({ accountId }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      return {
        ...item,
        schedulings: item.schedulings.map(({ status, ...scheduling }) => ({
          ...scheduling,
          status: "suspended",
        })),
      };
    });
    const Key = pathname.accountStrategies({ accountId });
    await putObject({ Key, data });
    return updatedNow();
  };
