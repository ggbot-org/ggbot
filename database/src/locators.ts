/*
 data-bucket/
 │
 ├╴account/
 │ └╴accountId=XXX/
 │   └╴account.json
 │
 ├╴accountConfig/
 │ └╴accountId=XXX/
 │   └╴binance.json
 │
 ├╴accountStrategies/
 │ └╴accountId=XXX/
 │   └╴strategies.json
 │
 ├╴accountTransactions/
 │ └╴accountId=XXX/
 │   └╴y=YYYY/
 │     └╴m=MM/
 │       └╴d=DD/
 │         └╴transactions.json
 │
 ├╴emailAccount/
 │ ├╴bitcoin.com/
 │ │ └╴nakamoto/
 │ │   └╴account.json
 │ └╴gmail.com/
 │   └╴jsmith/
 │     └╴account.json
 │
 ├╴oneTimePassword/
 │ ├╴bitcoin.com/
 │ │ └╴nakamoto/
 │ │   └╴otp.json
 │ └╴gmail.com/
 │   └╴jsmith/
 │     └╴otp.json
 │
 ├╴strategy/
 │ └╴strategyKind=XXX/
 │   └╴strategyId=XXX/
 │     └╴strategy.json
 │
 ├╴strategyExecution/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴execution.json
 │
 ├╴strategyFlow/
 │ └╴strategyKind=XXX/
 │   └╴strategyId=XXX/
 │     └╴flow.json
 │
 ├╴strategyMemory/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴memory.json
 │
 └╴StrategyTransactions/
   └╴accountId=XXX/
     └╴strategyKind=XXX/
       └╴strategyId=XXX/
         └╴y=YYYY/
           └╴m=MM/
             └╴d=DD/
               └╴transactions.json
*/

import {
  AccountDailyTransactionsKey,
  AccountKey,
  AccountStrategyKey,
  DayKey,
  EmailAddress,
  StrategyDailyTransactionsKey,
  StrategyKey,
  normalizeEmailAddress,
} from "@ggbot2/models";
import { splitDay } from "@ggbot2/time";

export const dirnamePrefix = {
  accountConfig: "accountConfig",
  account: "account",
  accountStrategyList: "accountStrategies",
  accountTransactions: "accountTransactions",
  emailAccount: "emailAccount",
  oneTimePassword: "oneTimePassword",
  strategy: "strategy",
  strategyExecution: "strategyExecution",
  strategyFlow: "strategyFlow",
  strategyMemory: "strategyMemory",
  strategyTransactions: "strategyTransactions",
};

export const itemKeyToDirname = {
  account: ({ accountId }: AccountKey) => `accountId=${accountId}`,
  accountStrategy: ({
    accountId,
    strategyKind,
    strategyId,
  }: AccountStrategyKey) =>
    `${itemKeyToDirname.account({ accountId })}/${itemKeyToDirname.strategy({
      strategyKind,
      strategyId,
    })}`,
  day: ({ day }: DayKey) => {
    const [yyyy, mm, dd] = splitDay(day);
    return `y=${yyyy}/m=${mm}/d=${dd}`;
  },
  strategy: ({ strategyId, strategyKind }: StrategyKey) =>
    `strategyKind=${strategyKind}/strategyId=${strategyId}`,
};

export const dirname = {
  account: (arg: AccountKey) =>
    `${dirnamePrefix.account}/${itemKeyToDirname.account(arg)}`,
  accountConfig: (arg: AccountKey) =>
    `${dirname.accountConfig}/${itemKeyToDirname.account(arg)}`,
  accountDailyTransactions: ({ accountId, day }: AccountDailyTransactionsKey) =>
    `${dirname.accountTransactions({ accountId })}/${itemKeyToDirname.day({
      day,
    })}`,
  accountStrategyList: (arg: AccountKey) =>
    `${dirnamePrefix.accountStrategyList}/${itemKeyToDirname.account(arg)}`,
  accountTransactions: ({ accountId }: AccountKey) =>
    `${dirnamePrefix.accountTransactions}/${itemKeyToDirname.account({
      accountId,
    })}`,
  email: (arg: EmailAddress) => {
    const normalizedEmailAddress = normalizeEmailAddress(arg);
    return normalizedEmailAddress.split("@").reverse().join("/");
  },
  strategy: (arg: StrategyKey) =>
    `${dirnamePrefix.strategy}/${itemKeyToDirname.strategy(arg)}`,
  strategyExecution: (arg: AccountStrategyKey) =>
    `${dirnamePrefix.strategyExecution}/${itemKeyToDirname.accountStrategy(
      arg
    )}`,
  strategyFlow: (arg: StrategyKey) =>
    `${dirnamePrefix.strategyFlow}/${itemKeyToDirname.strategy(arg)}`,
  strategyMemory: (arg: StrategyKey) =>
    `${dirnamePrefix.strategyMemory}/${itemKeyToDirname.strategy(arg)}`,
};

export const pathname = {
  account: (arg: AccountKey) => `${dirname.account(arg)}/account.json`,
  accountStrategyList: (arg: AccountKey) =>
    `${dirname.accountStrategyList(arg)}/strategies.json`,
  binanceApiConfig: (arg: AccountKey) =>
    `${dirname.accountConfig(arg)}/binance.json`,
  emailAccount: (arg: EmailAddress) =>
    `${dirnamePrefix.emailAccount}/${dirname.email(arg)}/email.json`,
  oneTimePassword: (arg: EmailAddress) =>
    `${dirnamePrefix.oneTimePassword}/${dirname.email(arg)}/otp.json`,
  strategy: (arg: StrategyKey) =>
    `${itemKeyToDirname.strategy(arg)}/strategy.json`,
  strategyExecution: (arg: AccountStrategyKey) =>
    `${dirname.strategyExecution(arg)}/execution.json`,
  strategyFlow: (arg: StrategyKey) => `${dirname.strategyFlow(arg)}/flow.json`,
  strategyMemory: (arg: AccountStrategyKey) =>
    `${dirname.strategyMemory(arg)}/memory.json`,
};
