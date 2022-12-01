import type { StrategyKey, InvalidStrategyKey } from "./types.js";

export const route = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
  apiVerify: () => "/api/auth/verify",
  authPage: () => "/auth",
  copyStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/copy/strategy/${strategyKind}/${strategyId}`,
  createStrategyPage: () => "/create/strategy",
  deleteAccountPage: () => "/delete/account",
  deleteBinanceApiConfigPage: () => "/delete/binance-api-config",
  deleteStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/delete/strategy/${strategyKind}/${strategyId}`,
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
  settingsPage: () => "/settings",
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/strategy/${strategyKind}/${strategyId}`,
  viewFlowPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/view/flow/${strategyKind}/${strategyId}`,
};
