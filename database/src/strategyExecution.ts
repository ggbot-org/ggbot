import {
  BinanceClient,
  BinanceConnector,
  BinanceKline,
  BinanceKlineInterval,
} from "@ggbot2/binance";
import {
  BinanceDflowClient,
  BinanceDflowExecutor,
  getDflowBinanceNodesCatalog,
} from "@ggbot2/dflow";
import {
  DeleteStrategyExecution,
  ExecuteStrategy,
  ReadStrategyExecution,
  StrategyExecution,
  WriteStrategyExecution,
  updatedNow,
} from "@ggbot2/models";
import { truncateTimestamp, now } from "@ggbot2/time";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import {
  ErrorAccountItemNotFound,
  ErrorStrategyItemNotFound,
  ErrorUnimplementedStrategyKind,
} from "./errors.js";
import { readStrategyFlow } from "./strategyFlow.js";
import { readStrategyMemory, writeStrategyMemory } from "./strategyMemory.js";

class Binance extends BinanceClient implements BinanceDflowClient {
  async candles(
    symbol: string,
    interval: BinanceKlineInterval,
    limit: number
  ): Promise<BinanceKline[]> {
    return await this.klines(symbol, interval, { limit });
  }
}

/** Execute a ggbot2 strategy.

It can either:
  - Point to the actual exchange.
  - Simulate an execution with a given balance or at a given time.

@throws {ErrorAccountItemNotFound}
@throws {ErrorStrategyItemNotFound}
@throws {ErrorUnimplementedStrategyKind} */
export const executeStrategy: ExecuteStrategy["func"] = async ({
  accountId,
  strategyId,
  strategyKind,
}) => {
  try {
    const accountStrategyKey = { accountId, strategyKind, strategyId };
    const strategyKey = { strategyKind, strategyId };

    const strategyFlow = await readStrategyFlow(accountStrategyKey);
    if (!strategyFlow)
      throw new ErrorStrategyItemNotFound({
        type: "StrategyFlow",
        ...strategyKey,
      });

    const strategyMemory = await readStrategyMemory(accountStrategyKey);
    const memoryInput = strategyMemory?.memory ?? {};

    if (strategyKind === "binance") {
      const baseUrl = BinanceConnector.defaultBaseUrl;

      const binanceApiConfig = await readBinanceApiConfig({ accountId });
      if (!binanceApiConfig)
        throw new ErrorAccountItemNotFound({
          type: "BinanceApiConfig",
          accountId,
        });

      const binance = new Binance({ baseUrl, ...binanceApiConfig });

      const { symbols } = await binance.exchangeInfo();
      const nodesCatalog = getDflowBinanceNodesCatalog({ symbols });

      const executor = new BinanceDflowExecutor(binance, symbols, nodesCatalog);
      const {
        execution,
        memory: memoryOutput,
        memoryChanged,
      } = await executor.run(
        {
          memory: memoryInput,
          timestamp: truncateTimestamp(now()).to.second(),
        },
        strategyFlow.view
      );

      // Handle memory changes.
      if (memoryChanged) {
        await writeStrategyMemory({
          accountId,
          strategyKind,
          strategyId,
          memory: memoryOutput,
        });
      }

      const executionStatus =
        execution?.status === "success" ? "success" : "failure";

      return {
        status: executionStatus,
        memory: memoryOutput,
        steps: execution?.steps ?? [],
        ...updatedNow(),
      };
    }
    throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId });
  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      throw error;
    console.error(error);
    throw error;
  }
};

export const readStrategyExecution: ReadStrategyExecution["func"] = async (
  arg
) =>
  await getObject<ReadStrategyExecution["out"]>({
    Key: pathname.strategyExecution(arg),
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
  const Key = pathname.strategyExecution({
    accountId,
    strategyKind,
    strategyId,
  });
  await putObject({ Key, data });
  return whenUpdated;
};

export const deleteStrategyExecution: DeleteStrategyExecution["func"] = async (
  arg
) => await deleteObject({ Key: pathname.strategyExecution(arg) });
