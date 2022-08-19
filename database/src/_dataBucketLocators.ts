// data-bucket/
// ├╴account/
// │ └╴accountId=XXX/
// │   └╴account.json
// │
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

export const accountKeyToDirname = ({ accountId }: AccountKey) =>
  `accountId=${accountId}`;

export const accountStrategyListDirnamePrefix = "accountStrategies";

export const accountStrategyListDirname = (accountKey: AccountKey) =>
  `${accountStrategyListDirnamePrefix}/${accountKeyToDirname(accountKey)}`;

export const strategyFlowDirnamePrefix = "strategyFlow";

export const strategyFlowDirname = (strategyKey: StrategyKey) =>
  `${strategyFlowDirnamePrefix}/${strategyKeyToDirname(strategyKey)}`;

export const strategyMemoryDirnamePrefix = "strategyMemory";

export const strategyMemoryDirname = (strategyKey: StrategyKey) =>
  `${strategyMemoryDirnamePrefix}/${strategyKeyToDirname(strategyKey)}`;

export const strategyMemoryPathname = (_: AccountStrategyKey) =>
  `${strategyMemoryDirname(_)}/flow.json`;

export const strategyKeyToDirname = ({
  strategyId,
  strategyKind,
}: StrategyKey) => `strategyKind=${strategyKind}/strategyId=${strategyId}`;
