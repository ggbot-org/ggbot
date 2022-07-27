import { StrategyKey, isStrategyKey } from "@ggbot2/models";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { readSession } from "./authentication";
import { redirectToAuthenticationPage, redirectToHomePage } from "./redirects";

export type { StrategyKey } from "@ggbot2/models";

export type HasSession = {
  hasSession: boolean;
};

export const requireAuthentication: GetServerSideProps = async ({ req }) =>
  readSession(req.cookies) ? { props: {} } : redirectToAuthenticationPage();

export const requireAuthenticationAndGetStrategyKey: GetServerSideProps =
  async ({ params, req }) => {
    const session = readSession(req.cookies);
    if (!session) return redirectToAuthenticationPage();

    const strategyKey = strategyKeyFromRouterParams(params);
    if (!strategyKey) return redirectToHomePage();

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
  if (!isStrategyKey(strategyKey)) return;
  return strategyKey;
};
