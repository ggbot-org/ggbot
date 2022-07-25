import { FC } from "react";
import { useApiAction } from "_hooks";

export const Strategies: FC = () => {
  const { data } = useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  console.log(data);

  return <div>strategies</div>;
};
