import {
  createdNow,
  DeleteAccountStrategiesItem,
  deletedNow,
  ErrorExceededQuota,
  InsertAccountStrategiesItem,
  isAccountStrategies,
  quota,
  ReadAccountStrategies,
  RenameAccountStrategiesItem,
  SuspendAccountStrategiesItemSchedulings,
  SuspendAccountStrategiesSchedulings,
  WriteAccountStrategiesItemSchedulings,
} from "@ggbot2/models";

import { putObject, READ, UPDATE } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { readSubscriptionPlan } from "./subscription.js";

export const readAccountStrategies: ReadAccountStrategies["func"] = (arg) =>
  READ<ReadAccountStrategies["out"]>(
    isAccountStrategies,
    pathname.accountStrategies(arg)
  );

export const insertAccountStrategiesItem: InsertAccountStrategiesItem["func"] =
  async ({ accountId, item }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const subscriptionPlan = await readSubscriptionPlan({ accountId });
    const numMaxStrategies = quota.MAX_STRATEGIES_PER_ACCOUNT(subscriptionPlan);
    if (items.length >= numMaxStrategies)
      throw new ErrorExceededQuota({ type: "MAX_STRATEGIES_PER_ACCOUNT" });
    const data = [...items, item];
    const Key = pathname.accountStrategies({ accountId });
    await putObject(Key, data);
    return createdNow();
  };

export const renameAccountStrategiesItem: RenameAccountStrategiesItem["func"] =
  async ({ accountId, strategyId, name }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return { ...item, name };
    });
    return await UPDATE(pathname.accountStrategies({ accountId }), data);
  };

export const writeAccountStrategiesItemSchedulings: WriteAccountStrategiesItemSchedulings["func"] =
  async ({ accountId, strategyId, schedulings }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return { ...item, schedulings };
    });
    return await UPDATE(pathname.accountStrategies({ accountId }), data);
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

export const suspendAccountStrategiesItemSchedulings: SuspendAccountStrategiesItemSchedulings["func"] =
  async ({ accountId, strategyId }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => {
      if (item.strategyId !== strategyId) return item;
      return {
        ...item,
        schedulings: item.schedulings.map((scheduling) => ({
          ...scheduling,
          status: "suspended",
        })),
      };
    });
    await UPDATE(pathname.accountStrategies({ accountId }), data);
  };

export const suspendAccountStrategiesSchedulings: SuspendAccountStrategiesSchedulings["func"] =
  async ({ accountId }) => {
    const items = (await readAccountStrategies({ accountId })) ?? [];
    const data = items.map((item) => ({
      ...item,
      schedulings: item.schedulings.map(
        ({ status: _status, ...scheduling }) => ({
          ...scheduling,
          status: "suspended",
        })
      ),
    }));
    return await UPDATE(pathname.accountStrategies({ accountId }), data);
  };
