import { Strategy, StrategyKey } from "@ggbot2/models";

export type { StrategyFlow, StrategyKey } from "@ggbot2/models";

export type HasSessionProp = {
  hasSession: boolean;
};

export type InvalidStrategyKey = {
  strategyKind: string;
  strategyId: string;
};

const settingsSectionIds = ["account", "binance", "billing"] as const;
export type SettingsSectionId = typeof settingsSectionIds[number];

export type StrategyInfo = {
  accountIsOwner: boolean;
  strategyKey: StrategyKey;
} & Pick<Strategy, "name" | "whenCreated">;
