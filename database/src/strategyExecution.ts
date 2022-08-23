import {
  BinanceClient,
  BinanceConnector,
  BinanceExchange,
} from "@ggbot2/binance";
import {
  BinanceDflowContext,
  BinanceDflowHost,
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
  try {
    const accountStrategyKey = { accountId, strategyKind, strategyId };
    const strategyKey = { strategyKind, strategyId };

    // Get memory from options or read it from stored data.
    const memory = await (async () => {
      if (optionalMemory) return optionalMemory;
      const data = await readStrategyMemory(accountStrategyKey);
      return data?.memory || {};
    })();

    // Get view from options or read it from stored data.
    const view = await (async () => {
      if (optionalView) return optionalView;
      const data = await readStrategyFlow(accountStrategyKey);
      if (!data) throw new ErrorStrategyFlowNotFound(strategyKey);
      return data.view;
    })();

    if (strategyKind === "binance") {
      const baseUrl = BinanceConnector.defaultBaseUrl;
      const exchange = new BinanceExchange({ baseUrl });

      const binanceApiConfig = dryRun
        ? // If `dryRun` mode is on, use a fake API config.
          { apiKey: "", apiSecret: "" }
        : await readBinanceApiConfig({ accountId });
      if (!binanceApiConfig)
        throw new ErrorMissingBinanceApiConfig({ accountId });

      const client = new BinanceClient({ baseUrl, ...binanceApiConfig });
      const nodesCatalog = await getDflowBinanceNodesCatalog({
        binance: exchange,
      });
      const dflow = new BinanceDflowHost(
        { nodesCatalog },
        { client, dryRun, exchange, memory, timestamp }
      );

      dflow.loadView(view);

      await dflow.run();

      // Compute balances (TODO get it from steps)
      // TODO Use optionalBalances to simulate account transactions
      const balances = optionalBalances.slice();

      // Handle memory changes
      if (dflow.context.memoryChanged) {
        if (!dryRun) {
          const memory = (dflow.context as BinanceDflowContext).memory ?? {};
          await writeStrategyMemory({
            accountId,
            strategyKind,
            strategyId,
            memory,
          });
        }
      }

      return {
        balances: [],
        status: "success",
        steps: [],
        ...updatedNow(),
      };
    }

    throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId });
  } catch (error) {
    console.error(error);

    return {
      balances,
      status: "failure",
      steps: [],
      ...updatedNow(),
    };
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
