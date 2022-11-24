import type { AccountKey } from "@ggbot2/models";
import type { FC } from "react";
import { useApiAction } from "_hooks";

type Props = AccountKey;

export const Account: FC<Props> = ({ accountId }) => {
  const { data } = useApiAction.READ_ACCOUNT({ accountId });

  if (!data) return null;

  const { email } = data;

  return <div>{email}</div>;
};
