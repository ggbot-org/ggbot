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
  /**
   * Read `executorId` from local disc or create a new one if it does not exist.
   */
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

  private accountKeysCache = new CacheMap<AccountKey[]>("ONE_HOUR");
  private accountStrategiesCache = new CacheMap<AccountStrategy[]>(
    "FIVE_MINUTES"
  );
  private subscriptionsCache = new CacheMap<Subscription>("ONE_HOUR");

  // TODO should also write somewhere this info, in case server restarts.
  private strategyWhenExecuted = new Map<string, Time>();

  constructor(readonly capacity: number, readonly index: number) {}

  async getAccountKeys(): Promise<AccountKey[]> {
    const { accountKeysCache: cache } = this;
    const key = "accountKeys";
    const cached = cache.get(key);
    if (cached) return cached;
    try {
      const data = await listAccountKeys();
      cache.set(key, data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  async getAccountStrategies(
    accountKey: AccountKey
  ): Promise<AccountStrategy[]> {
    const key = accountKey.accountId;
    const { accountStrategiesCache: cache } = this;
    const cached = cache.get(key);
    if (cached) return cached;
    try {
      const data = (await readAccountStrategies(accountKey)) ?? [];
      cache.set(key, data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  async getSubscription(
    accountKey: AccountKey
  ): Promise<Subscription | undefined> {
    const key = accountKey.accountId;
    const { subscriptionsCache: cache } = this;
    const cached = cache.get(key);
    if (cached) return cached;
    try {
      const data = await readSubscription(accountKey);
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
    await executeStrategy(accountStrategyKey);
  }

  managesItem(itemId: Item["id"]) {
    return (
      Executor.itemIdToNaturalNumber(itemId) % this.capacity === this.index
    );
  }

  async runTasks() {
    const accountKeys = await this.getAccountKeys();
    ACCOUNT: for (const accountKey of accountKeys) {
      try {
        // Get account.
        if (!isAccountKey(accountKey)) continue ACCOUNT;
        const { accountId } = accountKey;
        // Check subscription.
        const subscription = await this.getSubscription(accountKey);

        if (
          !isSubscription(subscription) ||
          subscriptionStatus(subscription) !== "active"
        ) {
          await this.suspendAccountStrategies(accountKey);
          continue ACCOUNT;
        }
        // Get strategies.
        const accountStrategies = await this.getAccountStrategies(accountKey);
        if (!Array.isArray(accountStrategies)) continue ACCOUNT;
        STRATEGY: for (const accountStrategy of accountStrategies) {
          if (!isAccountStrategy(accountStrategy)) continue STRATEGY;
          const { strategyId, strategyKind } = accountStrategy;
          const { schedulings } = accountStrategy;
          SCHEDULING: for (const scheduling of schedulings) {
            if (!isScheduling(scheduling)) continue SCHEDULING;
            // Execute scheduled strategies.
            try {
              await this.manageStrategyExecution(
                { accountId, strategyId, strategyKind },
                scheduling
              );
            } catch (error) {
              if (error instanceof ErrorAccountItemNotFound) {
                if (error.type === "BinanceApiConfig") {
                  await this.suspendAccountStrategies(accountKey);
                  continue STRATEGY;
                }
              }
              log.error(error);
            }
          }
        }
      } catch (error) {
        log.error(error);
        continue ACCOUNT;
      }
    }
  }

  async suspendAccountStrategies({ accountId }: AccountKey) {
    // TODO manage accountStrategiesCache
    try {
      log.info(`Suspend all strategies accountId=${accountId}`);
      await suspendAccountStrategiesSchedulings({ accountId });
    } catch (error) {
      log.error(error);
    }
  }
}
