import type { Strategy, StrategyKey } from "@ggbot2/models";

export type { StrategyKey } from "@ggbot2/models";

export type HasSession = {
  hasSession: boolean;
};

export type InvalidStrategyKey = {
  strategyKind: string;
  strategyId: string;
};

export type StrategyInfo = {
  accountIsOwner: boolean;
  strategyKey: StrategyKey;
} & Pick<Strategy, "name" | "whenCreated">;