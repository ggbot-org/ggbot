import { readStrategy } from "@ggbot2/database";
import { Strategy, StrategyKey, isStrategyKey } from "@ggbot2/models";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { readSession } from "./authentication";
import {
  redirectToAuthenticationPage,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
} from "./redirects";

export type { StrategyKey } from "@ggbot2/models";

export type HasSession = {
  hasSession: boolean;
};

export type InvalidStrategyKey = {
  strategyKind: string;
  strategyId: string;
};

export type StrategyInfo = {
  accountIsOwner: boolean;
  strategyKey: StrategyKey;
} & Pick<Strategy, "name" | "whenCreated">;

export const getStrategyInfo: GetServerSideProps = async ({ params, req }) => {
  const session = readSession(req.cookies);

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);

  return {
    props: {
      accountIsOwner: session?.accountId === strategy.accountId,
      strategyKey,
      name: strategy.name,
      whenCreated: strategy.whenCreated,
    },
  };
};

export const getStrategyKey: GetServerSideProps = async ({ params }) => {
  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

  return {
    props: strategyKey,
  };
};

export const requireAuthentication: GetServerSideProps = async ({ req }) =>
  readSession(req.cookies) ? { props: {} } : redirectToAuthenticationPage();

export const requireAuthenticationAndGetStrategyInfo: GetServerSideProps =
  async ({ params, req }) => {
    const session = readSession(req.cookies);
    if (!session) return redirectToAuthenticationPage();

    const strategyKey = strategyKeyFromRouterParams(params);
    if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

    const strategy = await readStrategy(strategyKey);
    if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);

    return {
      props: {
        accountIsOwner: session.accountId === strategy.accountId,
        strategyKey,
        name: strategy.name,
        whenCreated: strategy.whenCreated,
      },
    };
  };

export const requireAuthenticationAndGetStrategyKey: GetServerSideProps =
  async ({ params, req }) => {
    const session = readSession(req.cookies);
    if (!session) return redirectToAuthenticationPage();

    const strategyKey = strategyKeyFromRouterParams(params);
    if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

    return {
      props: strategyKey,
    };
  };

export const strategyKeyFromRouterParams = (
  params: GetServerSidePropsContext["params"]
): StrategyKey | undefined => {
  if (!params) return;
  const strategyKey = {
    strategyKind: params.strategyKind,
    strategyId: params.strategyId,
  };
  if (isStrategyKey(strategyKey)) return strategyKey;
};
