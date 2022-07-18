import { FC } from "react";
import { useApiAction } from "_hooks";

export const Accounts: FC = () => {
  const { data, error } = useApiAction({
    type: "READ_ACCOUNTS",
  });

  console.log(data, error);
  return <div>account</div>;
};
