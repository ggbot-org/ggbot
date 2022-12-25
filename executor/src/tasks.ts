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
} from "@ggbot2/models";
import { log } from "./log.js";

const sleep = (delay: number) =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(true);
    }, delay);
    process.on("SIGINT", () => {
      clearTimeout(timeoutId);
    });
  });

const suspendAccountStrategies = async ({ accountId }: AccountKey) => {
  try {
    log.info(`Suspend all strategies accountId=${accountId}`);
    await suspendAccountStrategiesSchedulings({ accountId });
  } catch (error) {
    log.error(error);
  }
};

export async function executorTasks() {
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
        await suspendAccountStrategies(accountKey);
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
                  await suspendAccountStrategies(accountKey);
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
  await sleep(1000 * 60 * 60);
}
