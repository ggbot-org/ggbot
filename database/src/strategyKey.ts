import type { StrategyKey } from "@ggbot2/models";

export const strategyKeyToDirname = ({
  strategyId,
  strategyKind,
}: StrategyKey) => `strategyKind=${strategyKind}/strategyId=${strategyId}`;
