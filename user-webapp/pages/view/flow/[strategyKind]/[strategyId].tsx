import { Button } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { ButtonShareStrategy, Content } from "_components";
import { useApiAction, useFlowView } from "_hooks";
import { StrategyInfo, getStrategyInfo, route } from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = getStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  name,
  strategyKey,
}) => {
  const router = useRouter();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const flowView = useFlowView({
    containerRef: flowViewContainerRef,
  });

  const { data } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

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

  useEffect(() => {
    if (data?.view) flowView?.loadGraph(data.view);
  }, [data, flowView]);

  return (
    <Content metadata={{ title: "ggbot2 strategy", description: name }}>
      <div className="flex h-full flex-col">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>
          <menu className="flex h-10 flex-row gap-4">
            {accountIsOwner ? (
              <Button color="primary" onClick={onClickEdit}>
                edit
              </Button>
            ) : (
              <Button color="primary" onClick={onClickCopy}>
                copy
              </Button>
            )}
            <ButtonShareStrategy {...strategyKey} />
          </menu>
        </div>

        <div className="w-full mb-2 grow" ref={flowViewContainerRef}></div>
      </div>
    </Content>
  );
};

export default Page;
