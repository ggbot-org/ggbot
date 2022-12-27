import type { AccountKey, StrategyKey } from "@ggbot2/models";

export class ErrorAccountItemNotFound extends Error {
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
      name: ErrorAccountItemNotFound.name,
      info: {
        accountId: String(this.accountId),
        type: this.type,
      },
    };
  }
}

export class ErrorStrategyItemNotFound extends Error {
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
      name: ErrorUnimplementedStrategyKind.name,
      info: {
        strategyKind: String(this.strategyKind),
      },
    };
  }
}
