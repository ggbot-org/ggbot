import { Button, DateTime } from "@ggbot2/ui-components";
import type { FlowView } from "flow-view";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SyntheticEvent, useCallback, useEffect, useRef } from "react";
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

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const flowViewRef = useRef<FlowView | null>(null);

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

  const importFlowView = useCallback(async () => {
    const { FlowView } = await import("flow-view");
    if (flowViewContainerRef.current === null) return;
    if (flowViewRef.current !== null) return;
    const flowView = new FlowView({
      container: flowViewContainerRef.current,
    });
    flowViewRef.current = flowView;
  }, [flowViewRef, flowViewContainerRef]);

  useEffect(() => {
    importFlowView();
  }, [importFlowView]);

  return (
    <Content metadata={{ title: "ggbot2 strategy", description: name }}>
      <div className="flex flex-col gap-4 p-4">
        <span className="text-xl">strategy</span>
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
          ) : (
            <Button color="primary" onClick={onClickCopy}>
              copy
            </Button>
          )}
        </menu>
        <div>
          <div className="h-96 w-full" ref={flowViewContainerRef}></div>
        </div>
      </div>
    </Content>
  );
};

export default Page;
