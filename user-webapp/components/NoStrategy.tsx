import { Button, ButtonOnClick, Message } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { route } from "_routing";
import { classNames } from "_classNames";

export const NoStrategy: FC = () => {
  const router = useRouter();

  const [newStrategyIsLoading, setNewStrategyIsLoading] = useState(false);

  const onClickNewStrategy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (newStrategyIsLoading) return;
      router.push(route.createStrategyPage());
      setNewStrategyIsLoading(true);
    },
    [newStrategyIsLoading, setNewStrategyIsLoading, router]
  );

  return (
    <Message color="info">
      <p className={classNames("mb-4", "is-size-4")}>You have no strategy yet.</p>

      <Button color="primary" isLoading={newStrategyIsLoading} onClick={onClickNewStrategy}>
        Create new strategy
      </Button>
    </Message>
  );
};
