export { isStrategyKey, type StrategyKey } from "@ggbot2/models";

export type HasSessionProp = {
  hasSession: boolean;
};

const settingsPageIds = ["account", "binance", "billing"] as const;
export type SettingsPageId = (typeof settingsPageIds)[number];
