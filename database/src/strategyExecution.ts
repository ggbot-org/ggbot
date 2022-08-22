import {
  BinanceClient,
  BinanceConnector,
  BinanceExchange,
} from "@ggbot2/binance";
import { BinanceDflowHost, getDflowBinanceNodesCatalog } from "@ggbot2/dflow";
import {
  DeleteStrategyExecution,
  ExecuteStrategy,
  ReadStrategyExecution,
  StrategyExecution,
  WriteStrategyExecution,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyExecutionPathname } from "./_dataBucketLocators.js";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import {
  ErrorMissingBinanceApiConfig,
  ErrorUnimplementedStrategyKind,
} from "./errors.js";
import { readStrategyFlow } from "./strategyFlow.js";
import { readStrategyMemory, writeStrategyMemory } from "./strategyMemory.js";

/**
 * Execute a ggbot2 strategy.
 *
 * It can point to the actual exchange or simulate an execution with a given balance or at a given time.
 *
 * @throws ErrorMissingBinanceApiConfig
 * @throws ErrorUnimplementedStrategyKind
 */
export const executeStrategy: ExecuteStrategy["func"] = async ({
  accountId,
  balances: optionalBalances = [],
  dryRun,
  memory: optionalMemory,
  strategyId,
  strategyKind,
  timestamp,
  view: optionalView,
}) => {
  const accountStrategyKey = { accountId, strategyKind, strategyId };

  // Get memory from optionalView or read it from stored data.
  const memory = await (async () => {
    if (optionalMemory) return optionalMemory;
    const data = await readStrategyMemory(accountStrategyKey);
    return data?.memory;
  })();

  // Get view from optionalView or read it from stored data.
  const view = await (async () => {
    if (optionalView) return optionalView;
    const data = await readStrategyFlow(accountStrategyKey);
    return data?.view;
  })();

  // TODO convert view to dflow
  console.log(view);

  if (strategyKind === "binance") {
    const baseUrl = BinanceConnector.defaultBaseUrl;
    const exchange = new BinanceExchange({ baseUrl });
    const binanceApiConfig = await readBinanceApiConfig({ accountId });
    if (!binanceApiConfig)
      throw new ErrorMissingBinanceApiConfig({ accountId });
    const client = new BinanceClient({ baseUrl, ...binanceApiConfig });
    const nodesCatalog = await getDflowBinanceNodesCatalog({
      binance: exchange,
    });
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { exchange, client, memory, timestamp }
    );

    await dflow.run({ verbose: true });

    const { status, steps } = dflow.executionReport;

    // Compute balances (TODO get it from steps)
    // TODO Use optionalBalances to simulate account transactions
    const balances = optionalBalances.slice();

    // Handle memory changes
    if (dflow.context.memoryChanged) {
      if (!dryRun) {
        const memory = dflow.context.memory;
        await writeStrategyMemory({
          accountId,
          strategyKind,
          strategyId,
          memory,
        });
      }
    }

    return {
      balances,
      status,
      steps,
      ...updatedNow(),
    };
  }

  throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId });
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
