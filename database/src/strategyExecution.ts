import {
  BinanceCacheMap,
  BinanceClient,
  BinanceClientConstructorArg,
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
  createdNow,
  DeleteStrategyExecution,
  ErrorAccountItemNotFound,
  ErrorStrategyItemNotFound,
  ErrorUnimplementedStrategyKind,
  ExecuteStrategy,
  newOrder,
  ReadStrategyExecution,
  StrategyExecution,
  updatedNow,
  WriteStrategyExecution,
} from "@ggbot2/models";
import { now, timeToDay, today, truncateTime } from "@ggbot2/time";

import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { appendAccountDailyOrders } from "./accountDailyOrders.js";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import { pathname } from "./locators.js";
import { appendStrategyDailyBalanceChanges } from "./strategyDailyBalanceChanges.js";
import { appendStrategyDailyOrders } from "./strategyDailyOrders.js";
import { readStrategyFlow } from "./strategyFlow.js";
import { readStrategyMemory, writeStrategyMemory } from "./strategyMemory.js";

class Binance extends BinanceClient implements BinanceDflowClient {
  constructor(arg: Pick<BinanceClientConstructorArg, "apiKey" | "apiSecret">) {
    super({
      ...arg,
      baseUrl: BinanceConnector.defaultBaseUrl,
      cache: new BinanceCacheMap(),
    });
  }
  async candles(
    symbol: string,
    interval: BinanceKlineInterval,
    limit: number
  ): Promise<BinanceKline[]> {
    return await this.klines(symbol, interval, { limit });
  }
}

/**
 * Execute a ggbot2 strategy.
 *
 * It can either:
 *
 * - Point to the actual exchange.
 * - Simulate an execution with a given balance or at a given time.
 *
 * @throws {@link ErrorAccountItemNotFound}
 * @throws {@link ErrorStrategyItemNotFound}
 * @throws {@link ErrorUnimplementedStrategyKind}
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
    if (!strategyFlow)
      throw new ErrorStrategyItemNotFound({
        type: "StrategyFlow",
        ...strategyKey,
      });

    const strategyMemory = await readStrategyMemory(accountStrategyKey);
    const memoryInput = strategyMemory?.memory ?? {};

    if (strategyKind === "binance") {
      const binanceApiConfig = await readBinanceApiConfig({ accountId });
      if (!binanceApiConfig)
        throw new ErrorAccountItemNotFound({
          type: "BinanceApiConfig",
          accountId,
        });

      const binance = new Binance(binanceApiConfig);

      // Truncate logical time to minute. It is a good compromise also to
      // cache klines data.
      const time = truncateTime(now()).to.minute();

      const { symbols } = await binance.exchangeInfo();
      const nodesCatalog = getDflowBinanceNodesCatalog({ symbols });

      const executor = new BinanceDflowExecutor(binance, symbols, nodesCatalog);
      try {
        const {
          balances,
          execution,
          memory: memoryOutput,
          memoryChanged,
          orders,
        } = await executor.run(
          {
            input: {},
            memory: memoryInput,
            time,
          },
          strategyFlow.view
        );

        // Handle memory changes.
        if (memoryChanged)
          await writeStrategyMemory({
            accountId,
            strategyKind,
            strategyId,
            memory: memoryOutput,
          });

        // TODO extract orders from execution
        // update order pools with orders that has temporary state
        // write other orders (e.g. filled) in history

        if (orders.length > 0) {
          const day = today();
          // TODO filter orders that are not filled, e.g. limit orders
          const strategyOrders = orders.map((info) => newOrder(info));

          await appendStrategyDailyOrders({
            accountId,
            strategyKind,
            strategyId,
            day,
            items: strategyOrders,
          });

          const accountOrders = strategyOrders.map((order) => ({
            order,
            strategyKind,
            strategyId,
          }));

          await appendAccountDailyOrders({
            accountId,
            day,
            items: accountOrders,
          });
        }

        if (balances.length > 0) {
          const { whenCreated } = createdNow();
          const day = timeToDay(truncateTime(whenCreated).to.day());
          await appendStrategyDailyBalanceChanges({
            accountId,
            strategyKind,
            strategyId,
            day,
            items: [{ whenCreated, balances }],
          });
        }

        const status = execution?.status === "success" ? "success" : "failure";
        const steps = execution?.steps ?? [];

        return { status, memory: memoryOutput, steps, ...updatedNow() };
      } catch (error) {
        console.error(error);
        return { status: "failure", memory: {}, steps: [], ...updatedNow() };
      }
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
