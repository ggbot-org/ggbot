import { Button } from "@ggbot2/ui-components";
import type { FlowViewOnChange } from "flow-view";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Content } from "_components";
import { ApiAction, useApiAction, useFlowView } from "_hooks";
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

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const { data } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

  const { isLoading: writeIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

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

  const onClickSave = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      if (writeIsLoading) return;
      if (!flowView) return;
      setNewStrategyFlow({ ...strategyKey, view: flowView.graph });
    },
    [flowView, setNewStrategyFlow, strategyKey]
  );

  useEffect(() => {
    if (!flowView) return;
    flowView.onChange(onChangeFlowView);
  }, [flowView, onChangeFlowView]);

  return (
    <Content>
      <div className="flex h-full flex-col">
        <div className="flex flex-row justify-between gap-4 py-3 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>

          <menu className="flex h-10 flex-row gap-4">
            <Button onClick={onClickManage}>manage</Button>
            <Button onClick={onClickSave}>save</Button>
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
