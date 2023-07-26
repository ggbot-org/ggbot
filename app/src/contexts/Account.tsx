import { Account, noneAccount } from "@ggbot2/models";
import { createContext, FC, PropsWithChildren, useMemo } from "react";

type ContextValue = {
  account: Account;
};

export const AccountContext = createContext<ContextValue>({
  account: noneAccount,
});

type Props = Pick<ContextValue, "account">;

export const AccountProvider: FC<PropsWithChildren<Props>> = ({
  children,
  account,
}) => {
  const contextValue = useMemo<ContextValue>(() => ({ account }), [account]);

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
};
