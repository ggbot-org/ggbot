import { GetServerSidePropsContext } from "next";
import { pathname } from "./pathnames";
import { InvalidStrategyKey, StrategyKey } from "./types";

export const redirectToAuthenticationPage = () => ({
  redirect: {
    destination: pathname.authPage(),
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
      destination: pathname.errorPageInvalidStrategyKey(invalidStrategyKey),
      permanent: false,
    },
  };
};

export const redirectToErrorPageStrategyNotFound = (
  strategyKey: StrategyKey
) => ({
  redirect: {
    destination: pathname.errorPageStrategyNotFound(strategyKey),
    permanent: false,
  },
});

export const redirectToErrorPageStrategyNotOwned = (
  strategyKey: StrategyKey
) => ({
  redirect: {
    destination: pathname.errorPageStrategyNotOwned(strategyKey),
    permanent: false,
  },
});

export const redirectToHomePage = () => ({
  redirect: {
    destination: pathname.homePage(),
    permanent: false,
  },
});