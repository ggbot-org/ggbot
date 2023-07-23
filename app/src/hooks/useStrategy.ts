import { isStrategy, Strategy } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

export const useStrategy = () => {
  const { request: READ, data, canRun } = useApi.ReadStrategy();

  const strategyKey = strategyKeyParamsFromCurrentLocation();
  let strategyName: Strategy["name"] = "";
  let strategyWhenCreated: Strategy["whenCreated"] | undefined;

  if (isStrategy(data)) {
    strategyName = data.name;
    strategyWhenCreated = data.whenCreated;
  }

  useEffect(() => {
    if (!strategyKey) return;
    if (canRun) READ(strategyKey);
  }, [canRun, READ, strategyKey]);

  return { strategyKey, strategyName, strategyWhenCreated };
};
