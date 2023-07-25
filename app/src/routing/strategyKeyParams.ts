import { isStrategyKey, StrategyKey } from "./types.js";

const strategyKindKey = "strategyKind";
const strategyIdKey = "strategyId";

export const strategyKeyParamsFromCurrentLocation = ():
  | StrategyKey
  | undefined => {
  const url = new URL(window.location.toString());

  const strategyKey = {
    strategyId: url.searchParams.get(strategyIdKey),
    strategyKind: url.searchParams.get(strategyKindKey),
  };

  if (isStrategyKey(strategyKey)) return strategyKey;
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
