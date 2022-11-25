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
  StrategyKey,
  isAccountKey,
  isAccountStrategyKey,
  isStrategyKey,
  normalizeEmailAddress,
  isLiteralType,
} from "@ggbot2/models";
import { joinDay, isSplittedDay, splitDay } from "@ggbot2/time";

export const dirnameDelimiter = "/";
const dirJoin = (parts: string[]) => parts.join(dirnameDelimiter);

const fieldNames = [
  "accountId",
  "strategyKind",
  "strategyId",
  "y",
  "m",
  "d",
] as const;
type FieldName = typeof fieldNames[number];
const isFieldName = isLiteralType<FieldName>(fieldNames);
const fieldSeparator = "=";
const fieldJoin = (name: FieldName, value: string) =>
  [name, value].join(fieldSeparator);

const dirnamePrefixes = [
  "accountConfig",
  "account",
  "accountStrategies",
  "accountTransactions",
  "emailAccount",
  "oneTimePassword",
  "strategy",
  "strategyExecution",
  "strategyFlow",
  "strategyMemory",
  "strategyTransactions",
] as const;

type DirnamePrefix = typeof dirnamePrefixes[number];

export const dirnamePrefix: Record<DirnamePrefix, string> = {
  account: "account",
  accountConfig: "accountConfig",
  accountStrategies: "accountStrategies",
  accountTransactions: "accountTransactions",
  emailAccount: "emailAccount",
  oneTimePassword: "oneTimePassword",
  strategy: "strategy",
  strategyExecution: "strategyExecution",
  strategyFlow: "strategyFlow",
  strategyMemory: "strategyMemory",
  strategyTransactions: "strategyTransactions",
};

const destructureLocator = (locator: string, fieldNames: FieldName[]) => {
  const result: Record<string, string> = {};
  for (const locatorPart of locator.split(dirnameDelimiter)) {
    const [fieldName, value] = locatorPart.split(fieldSeparator);
    if (!isFieldName(fieldName)) continue;
    // If value is `undefined`, this `locatorPart` could be a prefix. Skip it.
    if (value === undefined) continue;
    if (fieldNames.includes(fieldName)) result[fieldName] = value;
  }
  return result;
};

export const locatorToItemKey = {
  account: (locator: string): AccountKey | undefined => {
    const obj = destructureLocator(locator, ["accountId"]);
    return isAccountKey(obj) ? obj : undefined;
  },
  accountStrategy: (locator: string): AccountStrategyKey | undefined => {
    const obj = destructureLocator(locator, [
      "accountId",
      "strategyKind",
      "strategyId",
    ]);
    return isAccountStrategyKey(obj) ? obj : undefined;
  },
  day: (locator: string): DayKey | undefined => {
    const obj = destructureLocator(locator, ["y", "m", "d"]);
    return isSplittedDay(obj) ? { day: joinDay(obj) } : undefined;
  },
  strategy: (locator: string): StrategyKey | undefined => {
    const obj = destructureLocator(locator, ["strategyKind", "strategyId"]);
    return isStrategyKey(obj) ? obj : undefined;
  },
};

export const itemKeyToDirname = {
  account: ({ accountId }: AccountKey) => fieldJoin("accountId", accountId),
  accountStrategy: ({
    accountId,
    strategyKind,
    strategyId,
  }: AccountStrategyKey) =>
    [
      itemKeyToDirname.account({ accountId }),
      itemKeyToDirname.strategy({
        strategyKind,
        strategyId,
      }),
    ].join(dirnameDelimiter),
  day: ({ day }: DayKey) => {
    const [yyyy, mm, dd] = splitDay(day);
    return [`y=${yyyy}`, `m=${mm}`, `d=${dd}`].join(dirnameDelimiter);
  },
  strategy: ({ strategyId, strategyKind }: StrategyKey) =>
    [`strategyKind=${strategyKind}`, `strategyId=${strategyId}`].join(
      dirnameDelimiter
    ),
};

export const dirname = {
  account: (arg: AccountKey) =>
    dirJoin([`${dirnamePrefix.account}`, `${itemKeyToDirname.account(arg)}`]),
  accountConfig: (arg: AccountKey) =>
    dirJoin([dirnamePrefix.accountConfig, itemKeyToDirname.account(arg)]),
  accountDailyTransactions: ({ accountId, day }: AccountDailyTransactionsKey) =>
    dirJoin([
      dirname.accountTransactions({ accountId }),
      itemKeyToDirname.day({
        day,
      }),
    ]),
  accountStrategies: (arg: AccountKey) =>
    dirJoin([dirnamePrefix.accountStrategies, itemKeyToDirname.account(arg)]),
  accountTransactions: ({ accountId }: AccountKey) =>
    dirJoin([
      dirnamePrefix.accountTransactions,
      itemKeyToDirname.account({
        accountId,
      }),
    ]),
  email: (arg: EmailAddress) =>
    dirJoin(normalizeEmailAddress(arg).split("@").reverse()),
  strategy: (arg: StrategyKey) =>
    dirJoin([dirnamePrefix.strategy, itemKeyToDirname.strategy(arg)]),
  strategyExecution: (arg: AccountStrategyKey) =>
    dirJoin([
      dirnamePrefix.strategyExecution,
      itemKeyToDirname.accountStrategy(arg),
    ]),
  strategyFlow: (arg: StrategyKey) =>
    dirJoin([dirnamePrefix.strategyFlow, itemKeyToDirname.strategy(arg)]),
  strategyMemory: (arg: StrategyKey) =>
    dirJoin([dirnamePrefix.strategyMemory, itemKeyToDirname.strategy(arg)]),
};

const filename = {
  account: "account.json",
  accountStrategies: "strategies.json",
  binanceApiConfig: "binance.json",
  emailAccount: "email.json",
  oneTimePassword: "otp.json",
  strategy: "strategy.json",
  strategyExecution: "execution.json",
  strategyFlow: "flow.json",
  strategyMemory: "memory.json",
};

export const pathname = {
  account: (arg: AccountKey) =>
    dirJoin([dirname.account(arg), filename.account]),
  accountStrategies: (arg: AccountKey) =>
    dirJoin([dirname.accountStrategies(arg), filename.accountStrategies]),
  binanceApiConfig: (arg: AccountKey) =>
    dirJoin([dirname.accountConfig(arg), filename.binanceApiConfig]),
  emailAccount: (arg: EmailAddress) =>
    dirJoin([
      dirnamePrefix.emailAccount,
      dirname.email(arg),
      filename.emailAccount,
    ]),
  oneTimePassword: (arg: EmailAddress) =>
    dirJoin([
      dirnamePrefix.oneTimePassword,
      dirname.email(arg),
      filename.oneTimePassword,
    ]),
  strategy: (arg: StrategyKey) =>
    dirJoin([itemKeyToDirname.strategy(arg), filename.strategy]),
  strategyExecution: (arg: AccountStrategyKey) =>
    dirJoin([dirname.strategyExecution(arg), filename.strategyExecution]),
  strategyFlow: (arg: StrategyKey) =>
    dirJoin([dirname.strategyFlow(arg), filename.strategyFlow]),
  strategyMemory: (arg: AccountStrategyKey) =>
    dirJoin([dirname.strategyMemory(arg), filename.strategyMemory]),
};
