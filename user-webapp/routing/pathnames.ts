import type { StrategyKey } from "./serverSideProps";

export const route = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
  apiVerify: () => "/api/auth/verify",
  authPage: () => "/auth",
  createStrategyPage: () => "/create/strategy",
  deleteStrategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/delete/strategy/${strategyKind}/${strategyId}`,
  homePage: () => "/",
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/strategy/${strategyKind}/${strategyId}`,
};
