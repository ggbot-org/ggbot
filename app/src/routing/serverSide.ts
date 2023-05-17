import { isStrategyKey } from "@ggbot2/models";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { redirectToAuthenticationPage } from "./redirects";
import { StrategyKey } from "./types";

export const requireAuthentication: GetServerSideProps = async () =>
  redirectToAuthenticationPage();

export const requireAuthenticationAndGetStrategyInfo: GetServerSideProps =
  async () => redirectToAuthenticationPage();

export const requireAuthenticationAndGetStrategyKey: GetServerSideProps =
  async () => redirectToAuthenticationPage();

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
