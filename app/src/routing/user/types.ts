export const settingsPageIds = ["account", "binance", "billing"] as const
export type SettingsPageId = (typeof settingsPageIds)[number]