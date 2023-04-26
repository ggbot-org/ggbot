import { isAccountKey } from "@ggbot2/models";
import { Button } from "@ggbot2/design";
import { FC, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";
import { Account } from "./Account";

export const Accounts: FC = () => {
  const [request, { data: accountKeys }] = useApiAction.ListAccountKeys();

  const { accountIds, numAccounts } = useMemo(() => {
    const accountIds = Array.isArray(accountKeys)
      ? accountKeys.map((accountKey) =>
          isAccountKey(accountKey) ? accountKey.accountId : "unknown"
        )
      : [];
    return { accountIds, numAccounts: accountIds.length };
  }, [accountKeys]);

  useEffect(() => {
    const controller = request();
    return () => {
      controller.abort();
    };
  }, [request]);

  return (
    <div className="flex flex-col gap-2">
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
