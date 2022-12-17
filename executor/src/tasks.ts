import {
  ErrorAccountItemNotFound,
  executeStrategy,
  listAccountKeys,
  readAccountStrategies,
  suspendAccountStrategiesSchedulings,
} from "@ggbot2/database";
import { isAccountKey, isAccountStrategy, isScheduling } from "@ggbot2/models";
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

export async function executorTasks() {
  const accountKeys = await listAccountKeys();
  ACCOUNT: for (const accountKey of accountKeys) {
    try {
      if (!isAccountKey(accountKey)) continue ACCOUNT;
      const { accountId } = accountKey;
      const accountStrategies = await readAccountStrategies(accountKey);
      if (!Array.isArray(accountStrategies)) continue ACCOUNT;
      STRATEGY: for (const accountStrategy of accountStrategies) {
        if (!isAccountStrategy(accountStrategy)) continue STRATEGY;
        const { strategyId, strategyKind } = accountStrategy;
        const { schedulings } = accountStrategy;
        SCHEDULING: for (const scheduling of schedulings) {
          if (!isScheduling(scheduling)) continue SCHEDULING;
          const { status } = scheduling;
          if (status === "active") {
            try {
              await executeStrategy({ accountId, strategyId, strategyKind });
            } catch (error) {
              log.error(error);

              if (error instanceof ErrorAccountItemNotFound) {
                if (error.type === "BinanceApiConfig") {
                  try {
                    log.info(`Suspend all strategies accountId=${accountId}`);
                    await suspendAccountStrategiesSchedulings({ accountId });
                  } catch (error) {
                    log.error(error);
                    continue STRATEGY;
                  }
                  continue STRATEGY;
                }
              }
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
