import { Strategy, StrategyKey } from "@ggbot2/models";

export { isStrategyKey, type StrategyKey } from "@ggbot2/models";

export type HasSessionProp = {
  hasSession: boolean;
};

// TODO remove InvalidStrategyKey
export type InvalidStrategyKey = {
  strategyKind: string;
  strategyId: string;
};

const settingsPageIds = ["account", "binance", "billing"] as const;
export type SettingsPageId = (typeof settingsPageIds)[number];

// TODO StrategyInfo is not a routing type, remove it from here
export type StrategyInfo = {
  accountIsOwner: boolean;
  strategyKey: StrategyKey;
} & Pick<Strategy, "name" | "whenCreated">;
