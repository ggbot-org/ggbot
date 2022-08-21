// data-bucket/
// │
// ├╴account/
// │ └╴accountId=XXX/
// │   └╴account.json
// │
// ├╴accountConfig/
// │ └╴accountId=XXX/
// │   └╴binance.json
//
// ├╴accountStrategies/
// │ └╴accountId=XXX/
// │   └╴strategies.json
// │
// ├╴emailAccount/
// │ ├╴bitcoin.com/
// │ │ └╴nakamoto/
// │ │   └╴account.json
// │ └╴gmail.com/
// │   └╴jsmith/
// │     └╴account.json
// │
// ├╴strategy/
// │ └╴strategyKind=XXX/
// │   └╴strategyId=XXX/
// │     └╴strategy.json
// │
// ├╴strategyExecution/
// │ └╴accountId=XXX/
// │   └╴strategyKind=XXX/
// │     └╴strategyId=XXX/
// │       └╴execution.json
// │
// ├╴strategyFlow/
// │ └╴strategyKind=XXX/
// │   └╴strategyId=XXX/
// │     └╴flow.json
// │
// └╴strategyMemory/
//     └╴accountId=XXX/
//       └╴strategyKind=XXX/
//         └╴strategyId=XXX/
//           └╴memory.json

import type {
  AccountKey,
  AccountStrategyKey,
  StrategyKey,
} from "@ggbot2/models";

export const accountDirnamePrefix = "account";
export const accountConfigDirnamePrefix = "accountConfig";
export const accountStrategyListDirnamePrefix = "accountStrategies";
export const strategyExecutionDirnamePrefix = "StrategyExecution";
export const strategyFlowDirnamePrefix = "strategyFlow";
export const strategyMemoryDirnamePrefix = "strategyMemory";

export const accountDirname = (_: AccountKey) =>
  `${accountDirnamePrefix}/${accountKeyToDirname(_)}`;

export const accountConfigDirname = (_: AccountKey) =>
  `${accountConfigDirnamePrefix}/${accountKeyToDirname(_)}`;

export const accountKeyToDirname = ({ accountId }: AccountKey) =>
  `accountId=${accountId}`;

export const accountPathname = (_: AccountKey) =>
  `${accountDirname(_)}/account.json`;

export const accountStrategyKeyToDirname = ({
  accountId,
  strategyKind,
  strategyId,
}: AccountStrategyKey) =>
  `${accountKeyToDirname({ accountId })}/${strategyKeyToDirname({
    strategyKind,
    strategyId,
  })}`;

export const accountStrategyListDirname = (_: AccountKey) =>
  `${accountStrategyListDirnamePrefix}/${accountKeyToDirname(_)}`;

export const accountStrategyListPathname = (_: AccountKey) =>
  `${accountStrategyListDirname(_)}/strategies.json`;

export const binanceApiConfigPathname = (_: AccountKey) =>
  `${accountConfigDirname(_)}/binance.json`;

export const strategyExecutionDirname = (_: AccountStrategyKey) =>
  `${strategyExecutionDirnamePrefix}/${accountStrategyKeyToDirname(_)}`;

export const strategyExecutionPathname = (_: AccountStrategyKey) =>
  `${strategyExecutionDirname(_)}/executionr.json`;

export const strategyFlowDirname = (_: StrategyKey) =>
  `${strategyFlowDirnamePrefix}/${strategyKeyToDirname(_)}`;

export const strategyFlowPathname = (_: StrategyKey) =>
  `${strategyFlowDirname(_)}/flow.json`;

export const strategyMemoryDirname = (_: StrategyKey) =>
  `${strategyMemoryDirnamePrefix}/${strategyKeyToDirname(_)}`;

export const strategyMemoryPathname = (_: AccountStrategyKey) =>
  `${strategyMemoryDirname(_)}/flow.json`;

export const strategyKeyToDirname = ({
  strategyId,
  strategyKind,
}: StrategyKey) => `strategyKind=${strategyKind}/strategyId=${strategyId}`;
