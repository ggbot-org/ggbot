import { Button, DateTime } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SyntheticEvent, useCallback } from "react";
import { Content } from "_components";
import { StrategyInfo, getStrategyInfo, route } from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = getStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  name,
  strategyKey,
  whenCreated,
}) => {
  const router = useRouter();

  const onClickCopy = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.copyStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  const onClickEdit = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.editFlowPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">view strategy</span>
        <dl>
          <dt>name</dt>
          <dd>{name}</dd>
          <dt>created</dt>
          <dd>
            <DateTime format="time" value={whenCreated} />
          </dd>
        </dl>
        <menu className="flex flex-row gap-4">
          {accountIsOwner ? (
            <Button color="primary" onClick={onClickEdit}>
              edit
            </Button>
          ) : null}
          <Button onClick={onClickCopy}>copy</Button>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
