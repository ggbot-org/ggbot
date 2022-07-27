import { StrategyKey } from "@ggbot2/models";
import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useCallback } from "react";
import { route } from "_routing";

type Props = StrategyKey;

export const StrategyActions: FC<Props> = (strategyKey) => {
  const router = useRouter();

  const onClickFlow = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const onClickScheduling = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const onClickCopy = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const onClickDelete = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <div>
      <menu className="flex flex-row gap-4 overflow-x-scroll">
        <Button color="primary" onClick={onClickFlow}>
          flow
        </Button>
        <Button onClick={onClickScheduling}>scheduling</Button>
        <Button onClick={onClickCopy}>copy</Button>
        <Button color="danger" onClick={onClickDelete}>
          delete
        </Button>
      </menu>
    </div>
  );
};
