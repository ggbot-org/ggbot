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
  isAccountKey,
  isAccountStrategy,
  isSubscription,
  isScheduling,
  subscriptionStatus,
  Item,
  isNodeError,
  itemIdCharacters,
  newId,
} from "@ggbot2/models";
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

  constructor(readonly capacity: number, readonly index: number) {}

  managesItem(itemId: Item["id"]) {
    return (
      Executor.itemIdToNaturalNumber(itemId) % this.capacity === this.index
    );
  }

  async runTasks() {
    const accountKeys = await listAccountKeys();
    ACCOUNT: for (const accountKey of accountKeys) {
      try {
        // Get account.
        if (!isAccountKey(accountKey)) continue ACCOUNT;
        const { accountId } = accountKey;
        // Check subscription.
        const subscription = await readSubscription(accountKey);

        if (
          !isSubscription(subscription) ||
          subscriptionStatus(subscription) !== "active"
        ) {
          await this.suspendAccountStrategies(accountKey);
          continue ACCOUNT;
        }
        // Get strategies.
        const accountStrategies = await readAccountStrategies(accountKey);
        if (!Array.isArray(accountStrategies)) continue ACCOUNT;
        STRATEGY: for (const accountStrategy of accountStrategies) {
          if (!isAccountStrategy(accountStrategy)) continue STRATEGY;
          const { strategyId, strategyKind } = accountStrategy;
          const { schedulings } = accountStrategy;
          SCHEDULING: for (const scheduling of schedulings) {
            if (!isScheduling(scheduling)) continue SCHEDULING;
            // Execute scheduled strategies.
            const { status } = scheduling;
            if (status === "active") {
              try {
                await executeStrategy({ accountId, strategyId, strategyKind });
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
        }
      } catch (error) {
        log.error(error);
        continue ACCOUNT;
      }
    }
  }

  async suspendAccountStrategies({ accountId }: AccountKey) {
    try {
      log.info(`Suspend all strategies accountId=${accountId}`);
      await suspendAccountStrategiesSchedulings({ accountId });
    } catch (error) {
      log.error(error);
    }
  }
}
