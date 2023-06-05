import { isStrategy, Strategy } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

export const useStrategy = () => {
  const [READ, { data, isPending, error, aborted }] = useApi.ReadStrategy();

  const strategyKey = strategyKeyParamsFromCurrentLocation();
  let strategyName: Strategy["name"] = "";

  if (isStrategy(data)) {
    strategyName = data.name;
  }

  useEffect(() => {
    if (strategyKey === undefined) return;
    if (data !== undefined || isPending || aborted || error) return;
    const controller = READ(strategyKey);
    return () => controller.abort();
  }, [READ, aborted, data, error, isPending, strategyKey]);

  return { strategyKey, strategyName };
};
