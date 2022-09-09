import { nodeTextToViewType } from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import type { FlowViewOnChange, FlowViewSerializableNode } from "flow-view";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
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
    nodeTextToViewType,
  });

  const [flowLoaded, setFlowLoaded] = useState(false);

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const { data } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

  const { isLoading: writeIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

  useEffect(() => {
    try {
      if (!data?.view) return;
      flowView?.loadGraph(data.view);
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [data, flowView, setFlowLoaded]);

  const onChangeFlowView = useCallback<FlowViewOnChange>(
    ({ action, data }, info) => {
      switch (action) {
        case "CREATE_NODE": {
          if (!flowView) return;
          const { type, id } = data as FlowViewSerializableNode;
          if (!type) flowView.node(id).hasError = true;
        }
        default:
          console.log(action, data, info);
      }
    },
    [flowView]
  );

  const onClickManage = useCallback(() => {
    router.push(route.strategyPage(strategyKey));
  }, [router, strategyKey]);

  const onClickSave = useCallback(() => {
    if (!flowLoaded) return;
    if (writeIsLoading) return;
    if (!flowView) return;
    setNewStrategyFlow({ ...strategyKey, view: flowView.graph });
  }, [flowView, flowLoaded, setNewStrategyFlow, strategyKey, writeIsLoading]);

  const onClickRun = useCallback(() => {
    if (!flowLoaded) return;
  }, [flowLoaded]);

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
            <Button isLoading={writeIsLoading} onClick={onClickSave}>
              save
            </Button>
            <Button onClick={onClickRun}>run</Button>
          </menu>
        </div>

        <div className="w-full grow" ref={flowViewContainerRef}></div>
        <div className="my-2">memory</div>
      </div>
    </Content>
  );
};

export default Page;
