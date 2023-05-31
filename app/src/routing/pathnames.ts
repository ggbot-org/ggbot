// TODO remove this file, import pathname from @ggbot2/locators
import { pathname as _pathname } from "@ggbot2/locators";

import { InvalidStrategyKey, SettingsSectionId, StrategyKey } from "./types.js";

export const pathname = {
  apiEnter: () => "/api/auth/enter",
  apiExit: () => "/api/auth/exit",
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
  homePage: _pathname.homePage,
  settingsPage: (section: SettingsSectionId) => `/settings/${section}`,
  strategyPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/strategy/${strategyKind}/${strategyId}`,
  viewFlowPage: ({ strategyKind, strategyId }: StrategyKey) =>
    `/view/flow/${strategyKind}/${strategyId}`,
};
