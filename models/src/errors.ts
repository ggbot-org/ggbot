import { AccountKey } from "./account.js";
import { QuotaType } from "./quotas.js";
import { StrategyKey } from "./strategy.js";

export class ErrorAccountItemNotFound extends Error {
  static errorName = "ErrorAccountItemNotFound";
  static message({
    type,
    accountId,
  }: Pick<ErrorAccountItemNotFound, "type" | "accountId">) {
    return `${type} not found, accountId=${accountId}`;
  }
  readonly type: "Account" | "BinanceApiConfig" | "SubscriptionPurchase";
  readonly accountId: unknown;
  constructor({
    type,
    accountId,
  }: Pick<ErrorAccountItemNotFound, "type" | "accountId">) {
    super(ErrorAccountItemNotFound.message({ type, accountId }));
    this.type = type;
    this.accountId = accountId;
  }
  toObject() {
    return {
      name: ErrorAccountItemNotFound.errorName,
      info: {
        accountId: String(this.accountId),
        type: this.type,
      },
    };
  }
}

export class ErrorExceededQuota extends Error {
  static errorName = "ErrorExceededQuota";
  static message(type: ErrorExceededQuota["type"]) {
    return `${type} quota exceeded`;
  }
  readonly type: QuotaType;
  constructor({ type }: Pick<ErrorExceededQuota, "type">) {
    super(ErrorExceededQuota.message(type));
    this.type = type;
  }
  toObject() {
    return {
      name: ErrorExceededQuota.errorName,
      info: {
        type: this.type,
      },
    };
  }
}

export class ErrorInvalidArg extends Error {
  static errorName = "ErrorInvalidArg";
  static message(type: ErrorInvalidArg["type"]) {
    return `Invalid ${type}`;
  }
  readonly arg: unknown;
  readonly type: "EmailAddress" | "Name";
  constructor({ arg, type }: Pick<ErrorInvalidArg, "arg" | "type">) {
    super(ErrorInvalidArg.message(type));
    this.arg = arg;
    this.type = type;
  }
}

export class ErrorStrategyItemNotFound extends Error {
  static errorName = "ErrorStrategyItemNotFound";
  static message({
    type,
    strategyId,
  }: Pick<ErrorStrategyItemNotFound, "type" | "strategyId">) {
    return `${type} not found, strategyId=${strategyId}`;
  }
  readonly type: "Strategy" | "StrategyFlow";
  readonly strategyKind: unknown;
  readonly strategyId: unknown;
  constructor({
    type,
    strategyKind,
    strategyId,
  }: Pick<ErrorStrategyItemNotFound, "type" | "strategyKind" | "strategyId">) {
    super(ErrorStrategyItemNotFound.message({ type, strategyId }));
    this.type = type;
    this.strategyKind = strategyKind;
    this.strategyId = strategyId;
  }
}

export class ErrorPermissionOnStrategyItem extends Error {
  static errorName = "ErrorPermissionOnStrategyItem";
  static message({
    action,
    type,
  }: Pick<ErrorPermissionOnStrategyItem, "action" | "type">) {
    return `Cannot ${action} ${type}`;
  }
  readonly accountId: AccountKey["accountId"];
  readonly strategyKind: StrategyKey["strategyKind"];
  readonly strategyId: StrategyKey["strategyId"];
  readonly action: "delete" | "read" | "write";
  readonly type: "Strategy" | "StrategyFlow";
  constructor({
    accountId,
    action,
    strategyKind,
    strategyId,
    type,
  }: Pick<
    ErrorPermissionOnStrategyItem,
    "accountId" | "action" | "type" | "strategyKind" | "strategyId"
  >) {
    super(ErrorPermissionOnStrategyItem.message({ action, type }));
    this.accountId = accountId;
    this.action = action;
    this.type = type;
    this.strategyKind = strategyKind;
    this.strategyId = strategyId;
  }
}

export class ErrorUnimplementedStrategyKind extends Error {
  static errorName = "ErrorUnimplementedStrategyKind";
  static message(strategyKind: ErrorUnimplementedStrategyKind["strategyKind"]) {
    return `Unimplemented strategyKind ${strategyKind}`;
  }
  readonly strategyKind?: unknown;
  constructor(strategyKind: ErrorUnimplementedStrategyKind["strategyKind"]) {
    super(ErrorUnimplementedStrategyKind.message(strategyKind));
    this.strategyKind = strategyKind;
  }
  toObject() {
    return {
      name: ErrorUnimplementedStrategyKind.errorName,
      info: {
        strategyKind: String(this.strategyKind),
      },
    };
  }
}

export type NodeError = Error & {
  code?: string;
};

export const isNodeError = (arg: unknown): arg is NodeError => {
  if (!(arg instanceof Error)) return false;
  const { code } = arg as Partial<NodeError>;
  return typeof code === "string";
};
