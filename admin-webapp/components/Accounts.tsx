import { Button } from "@ggbot2/ui-components";
import { FC, useMemo } from "react";
import { useApiAction } from "_hooks";
import { Account } from "./Account";

export const Accounts: FC = () => {
  const { data } = useApiAction.READ_ACCOUNT_KEYS();

  const { accountIds, numAccounts } = useMemo(() => {
    if (!data) return { accountIds: [], numAccounts: "" };
    const accountIds = data.map(({ accountId }) => accountId);
    return { accountIds, numAccounts: accountIds.length };
  }, [data]);

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
