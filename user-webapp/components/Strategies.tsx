import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const Strategies: FC = () => {
  const router = useRouter();

  const { data } = useApiAction.READ_ACCOUNT_STRATEGY_LIST();
  console.log(data);

  const onClickNewStrategy = useCallback(() => {
    router.push(route.createStrategyPage());
  }, [router]);

  return (
    <div>
      strategies
      <menu>
        <Button onClick={onClickNewStrategy}>new strategy</Button>
      </menu>
    </div>
  );
};
