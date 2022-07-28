import type { InvalidStrategyKey, StrategyKey } from "./serverSideProps";

export const route = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
  apiVerify: () => "/api/auth/verify",
  authPage: () => "/auth",
  copyStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/copy/strategy/${strategyKind}/${strategyId}`,
  createStrategyPage: () => "/create/strategy",
  deleteStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/delete/strategy/${strategyKind}/${strategyId}`,
  errorPageInvalidStrategyKey: ({
    strategyKind,
    strategyId,
  }: InvalidStrategyKey) =>
    `/error/invalid-strategy-key/${strategyKind}/${strategyId}`,
  homePage: () => "/",
  scheduleStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/schedule/strategy/${strategyKind}/${strategyId}`,
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/strategy/${strategyKind}/${strategyId}`,
};
