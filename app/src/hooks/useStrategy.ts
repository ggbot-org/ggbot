import { isStrategy, Strategy } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

export const useStrategy = () => {
  const { request: READ, data, status: readStatus } = useApi.ReadStrategy();

  const strategyKey = strategyKeyParamsFromCurrentLocation();
  let strategyName: Strategy["name"] = "";
  let strategyWhenCreated: Strategy["whenCreated"] | undefined;

  if (isStrategy(data)) {
    strategyName = data.name;
    strategyWhenCreated = data.whenCreated;
  }

  useEffect(() => {
    if (strategyKey === undefined) return;
    if (readStatus) return;
    const controller = READ(strategyKey);
    return () => controller.abort();
  }, [READ, readStatus, strategyKey]);

  return { strategyKey, strategyName, strategyWhenCreated };
};
