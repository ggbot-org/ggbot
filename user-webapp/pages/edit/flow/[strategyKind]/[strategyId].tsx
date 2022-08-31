import { Button } from "@ggbot2/ui-components";
import type { FlowViewOnChange } from "flow-view";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { Content } from "_components";
import { useApiAction, useFlowView } from "_hooks";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ name, strategyKey }) => {
  const router = useRouter();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const flowView = useFlowView({
    containerRef: flowViewContainerRef,
  });

  const { data } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

  useEffect(() => {
    if (data?.view) flowView?.loadGraph(data.view);
  }, [data, flowView]);

  const onChangeFlowView = useCallback<FlowViewOnChange>(
    ({ action, data }, info) => {
      console.log(action, data, info);
    },
    []
  );

  const onClickManage = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.strategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  useEffect(() => {
    if (!flowView) return;
    flowView.onChange(onChangeFlowView);
  }, [flowView, onChangeFlowView]);

  return (
    <Content>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between py-3 gap-4 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>

          <menu className="flex flex-row h-10 gap-4">
            <Button onClick={onClickManage}>manage</Button>
            <Button>save</Button>
            <Button>run</Button>
          </menu>
        </div>

        <div className="w-full grow" ref={flowViewContainerRef}></div>
        <div className="my-2">memory</div>
      </div>
    </Content>
  );
};

export default Page;
