import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import {
  ErrorAccountItemNotFound,
  executeStrategy,
  listAccountKeys,
  readAccountStrategies,
  readSubscription,
  suspendAccountStrategiesSchedulings,
} from "@ggbot2/database";
import {
  AccountKey,
  AccountStrategy,
  AccountStrategyKey,
  CacheMap,
  Item,
  Scheduling,
  Subscription,
  frequencyIntervalDuration,
  isAccountKey,
  isAccountStrategy,
  isNodeError,
  isScheduling,
  isSubscription,
  itemIdCharacters,
  newId,
  subscriptionStatus,
} from "@ggbot2/models";
import { Time, now, truncateTime } from "@ggbot2/time";
import { log } from "./log.js";

const executorIdFile = join(homedir(), ".ggbot2-executor");

export class Executor {
  /** Read `executorId` from local disc or create a new one if it does not exist. */
  static async getExecutorId(): Promise<Item["id"]> {
    try {
      const executorId = await readFile(executorIdFile, "utf8");
      return executorId;
    } catch (error) {
      if (isNodeError(error)) {
        if (error.code === "ENOENT") {
          const executorId = newId();
          await writeFile(executorIdFile, executorId, "utf8");
          return executorId;
        }
      }
      throw error;
    }
  }

  static itemIdToNaturalNumber(itemId: Item["id"]) {
    const firstCharacter = itemId.charAt(0);
    for (let i = 0; i < itemIdCharacters.length; i++)
      if (itemIdCharacters.charAt(i) === firstCharacter) return i + 1;
    throw new TypeError();
  }

  accountKeysCache = new CacheMap<AccountKey[]>("ONE_HOUR");
  accountStrategiesCache = new CacheMap<AccountStrategy[]>("FIVE_MINUTES");
  subscriptionsCache = new CacheMap<Subscription>("ONE_HOUR");

  // TODO should also write somewhere this info, in case server restarts.
  strategyWhenExecuted = new Map<string, Time>();

  constructor(readonly capacity: number, readonly index: number) {}

  get cachedAccountKeys() {
    const key = "accountKeys";
    return {
      get: (): AccountKey[] | undefined => this.accountKeysCache.get(key),
      set: (data: AccountKey[]): void => this.accountKeysCache.set(key, data),
      removeItem: (accountId: AccountKey["accountId"]): void => {
        const items = this.accountKeysCache.get(key);
        if (!items) return;
        const updatedItems = items.filter(
          (item) => item.accountId !== accountId
        );
        this.accountKeysCache.set(key, updatedItems);
      },
    };
  }

  async getAccountKeys(): Promise<AccountKey[]> {
    try {
      const cached = this.cachedAccountKeys.get();
      if (cached) return cached;
      const data = await listAccountKeys();
      this.cachedAccountKeys.set(data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  async getAccountStrategies({
    accountId,
  }: AccountKey): Promise<AccountStrategy[]> {
    try {
      const key = accountId;
      const { accountStrategiesCache: cache } = this;
      const cached = cache.get(key);
      if (cached) return cached;
      log.info("readAccountStrategies");
      const data = (await readAccountStrategies({ accountId })) ?? [];
      cache.set(key, data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  async getSubscription({
    accountId,
  }: AccountKey): Promise<Subscription | undefined> {
    try {
      const key = accountId;
      const { subscriptionsCache: cache } = this;
      const cached = cache.get(key);
      if (cached) return cached;
      log.info("readSubscription", accountId);
      const data = await readSubscription({ accountId });
      if (isSubscription(data)) {
        cache.set(key, data);
        return data;
      }
    } catch (error) {
      log.error(error);
    }
  }

  async manageStrategyExecution(
    accountStrategyKey: AccountStrategyKey,
    scheduling: Scheduling
  ) {
    const { strategyWhenExecuted } = this;
    const { strategyId } = accountStrategyKey;
    const { status, frequency } = scheduling;
    if (status !== "active") return;
    const whenExecuted = strategyWhenExecuted.get(strategyId);
    const time = truncateTime(now()).to.minute();
    if (whenExecuted) {
      const pauseDuration = frequencyIntervalDuration(frequency);
      if (whenExecuted + pauseDuration > time) return;
    }
    strategyWhenExecuted.set(strategyId, time);
    log.info("execute strategy", strategyId);
    await executeStrategy(accountStrategyKey);
  }

  managesItem(itemId: Item["id"]) {
    return (
      Executor.itemIdToNaturalNumber(itemId) % this.capacity === this.index
    );
  }

  async runTasks() {
    const accountKeys = await this.getAccountKeys();
    for (const accountKey of accountKeys) {
      try {
        // Get account.
        if (!isAccountKey(accountKey)) continue;
        const { accountId } = accountKey;

        // Check subscription.
        const subscription = await this.getSubscription(accountKey);
        if (
          !isSubscription(subscription) ||
          subscriptionStatus(subscription) !== "active"
        ) {
          await this.suspendAccountStrategies(accountKey);
          continue;
        }

        // Get strategies.
        const accountStrategies = await this.getAccountStrategies(accountKey);
        if (!Array.isArray(accountStrategies)) continue;

        for (const accountStrategy of accountStrategies) {
          if (!isAccountStrategy(accountStrategy)) continue;
          const { strategyId, strategyKind, schedulings } = accountStrategy;

          for (const scheduling of schedulings) {
            if (!isScheduling(scheduling)) continue;

            // Execute scheduled strategies.
            await this.manageStrategyExecution(
              { accountId, strategyId, strategyKind },
              scheduling
            );
          }
        }
      } catch (error) {
        log.error(error);

        if (error instanceof ErrorAccountItemNotFound) {
          if (error.type === "BinanceApiConfig") {
            await this.suspendAccountStrategies(accountKey);
          }
        }

        continue;
      }
    }
  }

  async suspendAccountStrategies({ accountId }: AccountKey) {
    try {
      log.info(`Suspend all strategies accountId=${accountId}`);

      // Cleanup cache locally.
      this.cachedAccountKeys.removeItem(accountId);
      this.accountStrategiesCache.delete(accountId);

      // Update database remotely.
      await suspendAccountStrategiesSchedulings({ accountId });
    } catch (error) {
      log.error(error);
    }
  }
}
