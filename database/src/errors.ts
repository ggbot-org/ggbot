import type { AccountKey, StrategyKey } from "@ggbot2/models";

export class ErrorInvalidStrategyName extends Error {
  constructor(name: unknown) {
    super(`Invalid strategy name ${name}`);
  }
}

export class ErrorMissingAccountId extends Error {
  constructor() {
    super("Missing accountId");
  }
}

export class ErrorPermissionDeniedCannotDeleteStrategy extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
  }
}

export class ErrorPermissionDeniedCannotDeleteStrategyFlow extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
  }
}

export class ErrorPermissionDeniedCannotWriteStrategyFlow extends Error {
  constructor({
    accountId,
    strategyKey,
  }: AccountKey & { strategyKey: StrategyKey }) {
    super(JSON.stringify({ accountId, strategyKey }));
  }
}

export class ErrorStrategyNotFound extends Error {
  constructor(strategyKey: StrategyKey) {
    super(JSON.stringify(strategyKey));
  }
}

export class ErrorStrategyFlowNotFound extends Error {
  constructor(strategyKey: StrategyKey) {
    super(JSON.stringify(strategyKey));
  }
}
