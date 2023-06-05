import { isStrategyKey, StrategyKey } from "./types.js";

const strategyKindKey = "strategyKind";
const strategyIdKey = "strategyId";

export const strategyKeyParamsFromCurrentLocation = ():
  | StrategyKey
  | undefined => {
  const url = new URL(window.location.toString());

  const strategyKind = url.searchParams.get(strategyKindKey);
  const strategyId = url.searchParams.get(strategyIdKey);

  const strategyKey = { strategyId, strategyKind };

  if (isStrategyKey(strategyKey)) return strategyKey;

  return undefined;
};

export const strategyKeyToURLSearchParams = ({
  strategyId,
  strategyKind,
}: StrategyKey) => {
  const params = new URLSearchParams();
  params.append(strategyIdKey, strategyId);
  params.append(strategyKindKey, strategyKind);
  return params;
};
