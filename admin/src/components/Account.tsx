import { AccountKey, isAccount } from "@ggbot2/models";
import { FC, useEffect } from "react";

import { useApi } from "../hooks/useApi.js";

type Props = AccountKey;

export const Account: FC<Props> = ({ accountId }) => {
  const [request, { data: account }] = useApi.ReadAccount();

  let email = "";

  if (isAccount(account)) {
    email = account.email;
  }

  useEffect(() => {
    const controller = request({ accountId });
    return () => {
      controller.abort();
    };
  }, [accountId, request]);

  return <div>{email}</div>;
};
