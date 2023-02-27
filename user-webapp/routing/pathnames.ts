import { StrategyKey, InvalidStrategyKey } from "./types.js";

const settingsSectionIds = ["account", "binance", "billing"] as const;
export type SettingsSectionId = typeof settingsSectionIds[number];

export const route = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
  apiVerify: () => "/api/auth/verify",
  authPage: () => "/auth",
  apiPurchaseOrder: () => "/api/utrust/order",
  apiUtrustCallback: () => "/api/utrust/callback",
  copyStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/copy/strategy/${strategyKind}/${strategyId}`,
  createStrategyPage: () => "/create/strategy",
  deleteAccountPage: () => "/delete/account",
  deleteBinanceApiConfigPage: () => "/delete/binance-api-config",
  deleteStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/delete/strategy/${strategyKind}/${strategyId}`,
  editFlowPage: ({ strategyKind, strategyId }: StrategyKey) => `/edit/flow/${strategyKind}/${strategyId}`,
  errorPageInvalidStrategyKey: ({ strategyKind, strategyId }: InvalidStrategyKey) =>
    `/error/invalid-strategy-key/${strategyKind}/${strategyId}`,
  errorPageStrategyNotFound: ({ strategyKind, strategyId }: StrategyKey) =>
    `/error/strategy-not-found/${strategyKind}/${strategyId}`,
  errorPageStrategyNotOwned: ({ strategyKind, strategyId }: StrategyKey) =>
    `/error/strategy-not-owned/${strategyKind}/${strategyId}`,
  homePage: () => "/",
  settingsPage: (section: SettingsSectionId) => `/settings/${section}`,
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) => `/strategy/${strategyKind}/${strategyId}`,
  subscriptionCanceledPage: () => "/subscription/canceled",
  subscriptionThankYouPage: () => "/subscription/thank-you",
  viewFlowPage: ({ strategyKind, strategyId }: StrategyKey) => `/view/flow/${strategyKind}/${strategyId}`,
};
