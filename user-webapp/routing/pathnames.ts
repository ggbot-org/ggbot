/* eslint sort-keys: "error" */
import { InvalidStrategyKey, SettingsSectionId, StrategyKey } from "./types";

export const pathname = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
  apiPurchaseOrder: () => "/api/utrust/order",
  apiUtrustCallback: () => "/api/utrust/callback",
  apiVerify: () => "/api/auth/verify",
  authPage: () => "/auth",
  copyStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/copy/strategy/${strategyKind}/${strategyId}`,
  editFlowPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/edit/flow/${strategyKind}/${strategyId}`,
  errorPageInvalidStrategyKey: ({
    strategyKind,
    strategyId,
  }: InvalidStrategyKey) =>
    `/error/invalid-strategy-key/${strategyKind}/${strategyId}`,
  errorPageStrategyNotFound: ({ strategyKind, strategyId }: StrategyKey) =>
    `/error/strategy-not-found/${strategyKind}/${strategyId}`,
  errorPageStrategyNotOwned: ({ strategyKind, strategyId }: StrategyKey) =>
    `/error/strategy-not-owned/${strategyKind}/${strategyId}`,
  homePage: () => "/",
  settingsPage: (section: SettingsSectionId) => `/settings/${section}`,
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/strategy/${strategyKind}/${strategyId}`,
  subscriptionCanceledPage: () => "/subscription/canceled",
  subscriptionPurchasedPage: () => "/subscription/purchased",
  viewFlowPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/view/flow/${strategyKind}/${strategyId}`,
};
