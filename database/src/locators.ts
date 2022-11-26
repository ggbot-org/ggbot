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
 │ └╴y=YYYY/
 │   └╴m=MM/
 │     └╴d=DD/
 │       └╴accountId=XXX/
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
 ├╴strategyOrdersPool/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴orders.json
 │
 ├╴strategyMemory/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴memory.json
 │
 └╴strategyTransactions/
   └╴y=YYYY/
     └╴m=MM/
       └╴d=DD/
         └╴accountId=XXX/
           └╴strategyKind=XXX/
             └╴strategyId=XXX/
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
  isAccountDailyTransactionsKey,
  isAccountKey,
  isAccountStrategyKey,
  isLiteralType,
  isStrategyDailyTransactionsKey,
  isStrategyKey,
  normalizeEmailAddress,
} from "@ggbot2/models";
import { joinDay, isSplittedDay, splitDay } from "@ggbot2/time";

export const dirnameDelimiter = "/";
const dirJoin = (parts: string[]) => parts.join(dirnameDelimiter);

const dayKeyFields = ["y", "m", "d"] as const;
const accountKeyFields = ["accountId"] as const;
const strategyKeyFields = ["strategyKind", "strategyId"] as const;
const fieldNames = [
  ...accountKeyFields,
  ...strategyKeyFields,
  ...dayKeyFields,
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
  "strategyOrdersPool",
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
  strategyOrdersPool: "strategyOrdersPool",
  strategyTransactions: "strategyTransactions",
};

const destructureLocator = (
  locator: string,
  fieldNames: readonly FieldName[]
) => {
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
  accountDailyTransactions: (
    locator: string
  ): AccountDailyTransactionsKey | undefined => {
    const obj = destructureLocator(locator, [
      ...accountKeyFields,
      ...dayKeyFields,
    ]);
    return isAccountDailyTransactionsKey(obj) ? obj : undefined;
  },
  accountStrategy: (locator: string): AccountStrategyKey | undefined => {
    const obj = destructureLocator(locator, [
      ...accountKeyFields,
      ...strategyKeyFields,
    ]);
    return isAccountStrategyKey(obj) ? obj : undefined;
  },
  day: (locator: string): DayKey | undefined => {
    const obj = destructureLocator(locator, dayKeyFields);
    return isSplittedDay(obj) ? { day: joinDay(obj) } : undefined;
  },
  strategy: (locator: string): StrategyKey | undefined => {
    const obj = destructureLocator(locator, strategyKeyFields);
    return isStrategyKey(obj) ? obj : undefined;
  },
  strategyDailyTransactions: (
    locator: string
  ): StrategyDailyTransactionsKey | undefined => {
    const obj = destructureLocator(locator, [
      ...dayKeyFields,
      ...accountKeyFields,
      ...strategyKeyFields,
    ]);
    return isStrategyDailyTransactionsKey(obj) ? obj : undefined;
  },
};

export const itemKeyToDirname = {
  account: ({ accountId }: AccountKey) => fieldJoin("accountId", accountId),
  accountDailyTransactions: ({ day, ...key }: AccountDailyTransactionsKey) =>
    dirJoin([itemKeyToDirname.day({ day }), itemKeyToDirname.account(key)]),
  accountStrategy: ({ accountId, ...strategyKey }: AccountStrategyKey) =>
    dirJoin([
      itemKeyToDirname.account({ accountId }),
      itemKeyToDirname.strategy(strategyKey),
    ]),
  day: ({ day }: DayKey) => {
    const [yyyy, mm, dd] = splitDay(day);
    return dirJoin([`y=${yyyy}`, `m=${mm}`, `d=${dd}`]);
  },
  strategy: ({ strategyId, strategyKind }: StrategyKey) =>
    dirJoin([
      fieldJoin("strategyKind", strategyKind),
      fieldJoin("strategyId", strategyId),
    ]),
  strategyDailyTransactions: ({ day, ...key }: StrategyDailyTransactionsKey) =>
    dirJoin([
      itemKeyToDirname.day({ day }),
      itemKeyToDirname.accountStrategy(key),
    ]),
};

export const dirname = {
  account: (arg: AccountKey) =>
    dirJoin([`${dirnamePrefix.account}`, `${itemKeyToDirname.account(arg)}`]),
  accountConfig: (arg: AccountKey) =>
    dirJoin([dirnamePrefix.accountConfig, itemKeyToDirname.account(arg)]),
  accountDailyTransactions: (arg: AccountDailyTransactionsKey) =>
    dirJoin([
      dirnamePrefix.accountTransactions,
      itemKeyToDirname.accountDailyTransactions(arg),
    ]),
  accountStrategies: (arg: AccountKey) =>
    dirJoin([dirnamePrefix.accountStrategies, itemKeyToDirname.account(arg)]),
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
  strategyOrdersPool: (arg: StrategyKey) =>
    dirJoin([dirnamePrefix.strategyOrdersPool, itemKeyToDirname.strategy(arg)]),
  strategyDailyTransactions: (arg: StrategyDailyTransactionsKey) =>
    dirJoin([
      dirnamePrefix.strategyTransactions,
      itemKeyToDirname.strategyDailyTransactions(arg),
    ]),
};

const filename = {
  account: "account.json",
  accountStrategies: "strategies.json",
  accountTransactions: "transactions.json",
  binanceApiConfig: "binance.json",
  emailAccount: "email.json",
  oneTimePassword: "otp.json",
  strategy: "strategy.json",
  strategyExecution: "execution.json",
  strategyFlow: "flow.json",
  strategyMemory: "memory.json",
  strategyOrdersPool: "orders.json",
  strategyTransactions: "transactions.json",
};

export const pathname = {
  account: (arg: AccountKey) =>
    dirJoin([dirname.account(arg), filename.account]),
  accountStrategies: (arg: AccountKey) =>
    dirJoin([dirname.accountStrategies(arg), filename.accountStrategies]),
  accountTransactions: (arg: AccountDailyTransactionsKey) =>
    dirJoin([
      dirname.accountDailyTransactions(arg),
      filename.accountTransactions,
    ]),
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
    dirJoin([dirname.strategy(arg), filename.strategy]),
  strategyExecution: (arg: AccountStrategyKey) =>
    dirJoin([dirname.strategyExecution(arg), filename.strategyExecution]),
  strategyFlow: (arg: StrategyKey) =>
    dirJoin([dirname.strategyFlow(arg), filename.strategyFlow]),
  strategyMemory: (arg: AccountStrategyKey) =>
    dirJoin([dirname.strategyMemory(arg), filename.strategyMemory]),
  strategyOrdersPool: (arg: AccountStrategyKey) =>
    dirJoin([dirname.strategyOrdersPool(arg), filename.strategyOrdersPool]),
  strategyTransactions: (arg: StrategyDailyTransactionsKey) =>
    dirJoin([
      dirnamePrefix.strategyTransactions,
      dirname.strategyDailyTransactions(arg),
      filename.strategyTransactions,
    ]),
};
