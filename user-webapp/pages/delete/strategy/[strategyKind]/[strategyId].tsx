import { Button } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { FormEventHandler, useCallback, useState } from "react";
import { Content } from "_components";
import { useApiAction } from "_hooks";
import {
  StrategyKey,
  requireAuthenticationAndGetStrategyKey,
  useGoBack,
} from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = (strategyKey) => {
  const goBack = useGoBack();
  const [strategyKeyToBeDeleted, setStrategyKeyToBeDeleted] = useState<
    StrategyKey | undefined
  >();

  const { isLoading } = useApiAction.DELETE_STRATEGY(strategyKeyToBeDeleted);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isLoading) return;
      setStrategyKeyToBeDeleted(strategyKey);
    },
    [isLoading, setStrategyKeyToBeDeleted, strategyKey]
  );

  return (
    <Content>
      <form className="p-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <span className="text-xl">delete strategy</span>
        <div>are you sure you want to delete strategy?</div>
        <menu className="flex flex-row gap-4">
          <Button type="reset" onClick={goBack}>
            no, go back
          </Button>
          <Button type="submit" color="danger">
            yes, delete it
          </Button>
        </menu>
      </form>
    </Content>
  );
};

export default Page;
