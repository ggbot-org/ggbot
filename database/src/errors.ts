import type { AccountKey, StrategyKey } from "@ggbot2/models";

export class ErrorMissingAccountId extends Error {
  constructor() {
    super("Missing accountId");
    this.name = ErrorMissingAccountId.name;
  }
}

export class ErrorMissingBinanceApiConfig extends Error {
  constructor({ accountId }: AccountKey) {
    super(JSON.stringify({ accountId }));
    this.name = ErrorMissingBinanceApiConfig.name;
  }
}

export class ErrorPermissionDeniedCannotDeleteStrategy extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
    this.name = ErrorPermissionDeniedCannotDeleteStrategy.name;
  }
}

export class ErrorPermissionDeniedCannotDeleteStrategyFlow extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
    this.name = ErrorPermissionDeniedCannotDeleteStrategyFlow.name;
  }
}

export class ErrorPermissionDeniedCannotWriteStrategyFlow extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
    this.name = ErrorPermissionDeniedCannotWriteStrategyFlow.name;
  }
}

export class ErrorStrategyNotFound extends Error {
  constructor(strategyKey: StrategyKey) {
    super(JSON.stringify(strategyKey));
    this.name = ErrorStrategyNotFound.name;
  }
}

export class ErrorStrategyFlowNotFound extends Error {
  constructor(strategyKey: StrategyKey) {
    super(JSON.stringify(strategyKey));
    this.name = ErrorStrategyFlowNotFound.name;
  }
}

export class ErrorUnimplementedStrategyKind extends Error {
  constructor(strategyKey: StrategyKey) {
    super(JSON.stringify(strategyKey));
    this.name = ErrorUnimplementedStrategyKind.name;
  }
}
