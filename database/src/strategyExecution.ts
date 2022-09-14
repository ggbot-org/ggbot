import { BinanceClient, BinanceConnector } from "@ggbot2/binance";
import { BinanceDflowExecutor } from "@ggbot2/dflow";
import {
  DeleteStrategyExecution,
  ExecuteStrategy,
  ReadStrategyExecution,
  StrategyExecution,
  WriteStrategyExecution,
  updatedNow,
  StrategyMemory,
} from "@ggbot2/models";
import { now, truncateTimestamp } from "@ggbot2/time";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyExecutionPathname } from "./_dataBucketLocators.js";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import {
  ErrorMissingBinanceApiConfig,
  ErrorStrategyFlowNotFound,
  ErrorUnimplementedStrategyKind,
} from "./errors.js";
import { readStrategyFlow } from "./strategyFlow.js";
import { readStrategyMemory, writeStrategyMemory } from "./strategyMemory.js";

/**
 * Execute a ggbot2 strategy.
 *
 * It can point to the actual exchange or simulate an execution with a given balance or at a given time.
 *
 * @throws {ErrorMissingBinanceApiConfig}
 * @throws {ErrorUnimplementedStrategyKind}
 */
export const executeStrategy: ExecuteStrategy["func"] = async ({
  accountId,
  strategyId,
  strategyKind,
}) => {
  try {
    const accountStrategyKey = { accountId, strategyKind, strategyId };
    const strategyKey = { strategyKind, strategyId };

    const strategyFlow = await readStrategyFlow(accountStrategyKey);
    if (!strategyFlow) throw new ErrorStrategyFlowNotFound(strategyKey);

    const memory = ((await readStrategyMemory(accountStrategyKey)) ??
      {}) as StrategyMemory;

    if (strategyKind === "binance") {
      const baseUrl = BinanceConnector.defaultBaseUrl;

      const binanceApiConfig = await readBinanceApiConfig({ accountId });
      if (!binanceApiConfig)
        throw new ErrorMissingBinanceApiConfig({ accountId });

      const binance = new BinanceClient({ baseUrl, ...binanceApiConfig });

      const executor = new BinanceDflowExecutor({
        binance,
        view: strategyFlow.view,
      });
      await executor.prepare();
      const result = await executor.run({
        memory,
        timestamp: truncateTimestamp({ value: now(), to: "second" }),
      });

      // Handle memory changes
      if (result.memoryChanged) {
        await writeStrategyMemory({
          accountId,
          strategyKind,
          strategyId,
          memory: result.memory,
        });
      }

      return {
        status: "success",
        ...updatedNow(),
      };
    }
    throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId });
  } catch (error) {
    if (
      error instanceof ErrorMissingBinanceApiConfig ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      throw error;
    console.error(error);
    throw error;
  }
};

export const readStrategyExecution: ReadStrategyExecution["func"] = async (_) =>
  await getObject<ReadStrategyExecution["out"]>({
    Key: strategyExecutionPathname(_),
  });

export const writeStrategyExecution: WriteStrategyExecution["func"] = async ({
  accountId,
  strategyKind,
  strategyId,
  ...rest
}) => {
  const whenUpdated = updatedNow();
  const data: StrategyExecution = {
    ...rest,
    ...whenUpdated,
  };
  const Key = strategyExecutionPathname({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyExecution: DeleteStrategyExecution["func"] = async (
  _
) => await deleteObject({ Key: strategyExecutionPathname(_) });
