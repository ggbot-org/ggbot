import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const Strategies: FC = () => {
  const router = useRouter();

  const { data: strategies } = useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  const onClickNewStrategy = useCallback(() => {
    router.push(route.createStrategyPage());
  }, [router]);

  console.log(strategies);
  return (
    <div>
      strategies
      <menu>
        <Button onClick={onClickNewStrategy}>new strategy</Button>
      </menu>
      {strategies?.map(({ name, strategyId }) => (
        <div key={strategyId}>{name}</div>
      ))}
    </div>
  );
};
