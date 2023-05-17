import { useApi } from "_hooks/useApi";
import { Button } from "@ggbot2/design";
import { isAccountKey } from "@ggbot2/models";
import { FC, useEffect } from "react";

import { Account } from "./Account";

export const Accounts: FC = () => {
  const [request, { data: accountKeys }] = useApi.ListAccountKeys();

  const accountIds: string[] = [];

  if (Array.isArray(accountKeys)) {
    for (const accountKey of accountKeys) {
      if (isAccountKey(accountKey)) {
        accountIds.push(accountKey.accountId);
      }
    }
  }

  const numAccounts: number | undefined = accountKeys
    ? accountIds.length
    : undefined;

  useEffect(() => {
    const controller = request();
    return () => {
      controller.abort();
    };
  }, [request]);

  return (
    <div>
      <div>accounts</div>

      <div>
        <Button color="primary">update</Button>
      </div>

      <div>{numAccounts}</div>

      <div>
        {accountIds.map((accountId) => (
          <Account key={accountId} accountId={accountId} />
        ))}
      </div>
    </div>
  );
};
