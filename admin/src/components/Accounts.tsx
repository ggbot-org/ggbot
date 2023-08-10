import { Button } from "@ggbot2/design";
import { isAccountKey } from "@ggbot2/models";
import { FC } from "react";

// import { useApi } from "../hooks/useApi.js";
import { Account } from "./Account.js";

export const Accounts: FC = () => {
  // const ListAccountKeys = useApi.ListAccountKeys();
  const accountKeys: unknown[] = []; // ListAccountKeys.data;

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

  // useEffect(() => {
  //   if (ListAccountKeys.canRun) ListAccountKeys.request();
  // }, [ListAccountKeys]);

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
