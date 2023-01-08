import { AccountKey, isAccount } from "@ggbot2/models";
import { FC, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";

type Props = AccountKey;

export const Account: FC<Props> = ({ accountId }) => {
  const [request, { data: account }] = useApiAction.ReadAccount();

  useEffect(() => {
    const controller = request({ accountId });
    return () => {
      controller.abort();
    };
  }, [accountId, request]);

  const { email } = useMemo(
    () => (isAccount(account) ? { email: account.email } : { email: "" }),
    [account]
  );

  return <div>{email}</div>;
};
