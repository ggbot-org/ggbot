import { isAccountStrategies, ReadAccountStrategies } from "@ggbot2/models";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";

import { useApi } from "../hooks/useApi.js";

type ContextValue = {
  accountStrategies: ReadAccountStrategies["out"] | undefined;
  refetchAccountStrategies: () => void;
};

export const AccountStrategiesContext = createContext<ContextValue>({
  accountStrategies: undefined,
  refetchAccountStrategies: () => {},
});

AccountStrategiesContext.displayName = "AccountStrategies";

export const AccountStrategiesProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const READ = useApi.ReadAccountStrategies();

  const contextValue = useMemo(
    () => ({
      accountStrategies:
        READ.data === null || isAccountStrategies(READ.data)
          ? READ.data
          : undefined,
      refetchAccountStrategies: READ.reset,
    }),
    [READ]
  );

  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  return (
    <AccountStrategiesContext.Provider value={contextValue}>
      {children}
    </AccountStrategiesContext.Provider>
  );
};
