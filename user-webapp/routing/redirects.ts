import type { GetServerSidePropsContext } from "next";
import { route } from "./pathnames";
import type { InvalidStrategyKey, StrategyKey } from "./types";

export const redirectToAuthenticationPage = () => ({
  redirect: {
    destination: route.authPage(),
    permanent: false,
  },
});

export const redirectToErrorPageInvalidStrategyKey = (
  params: GetServerSidePropsContext["params"]
) => {
  const invalidStrategyKey: InvalidStrategyKey = {
    strategyKind: params?.strategyKind?.toString() ?? "undefined",
    strategyId: params?.strategyId?.toString() ?? "undefined",
  };
  return {
    redirect: {
      destination: route.errorPageInvalidStrategyKey(invalidStrategyKey),
      permanent: false,
    },
  };
};

export const redirectToErrorPageStrategyNotFound = (
  strategyKey: StrategyKey
) => {
  return {
    redirect: {
      destination: route.errorPageStrategyNotFound(strategyKey),
      permanent: false,
    },
  };
};

export const redirectToErrorPageStrategyNotOwned = (
  strategyKey: StrategyKey
) => {
  return {
    redirect: {
      destination: route.errorPageStrategyNotOwned(strategyKey),
      permanent: false,
    },
  };
};

export const redirectToHomePage = () => ({
  redirect: {
    destination: route.homePage(),
    permanent: false,
  },
});
