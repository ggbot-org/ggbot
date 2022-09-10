import { nodeTextToViewType } from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import type { FlowViewOnChange, FlowViewOnChangeDataNode } from "flow-view";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [manageIsLoading, setManageIsLoading] = useState(false);

  const [strategyKeyToBeExecuted, setStrategyKeyToBeExecuted] =
    useState<ApiAction["EXECUTE_STRATEGY"]["in"]>();

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const { data: storedStrategyFlow } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

  const { data: strategyExecution, isLoading: runIsLoading } =
    useApiAction.EXECUTE_STRATEGY(strategyKeyToBeExecuted);

  const { data: saveData, isLoading: saveIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

  const onChangeFlowView = useCallback<FlowViewOnChange>(
    ({ action, data }, info) => {
      switch (action) {
        case "CREATE_NODE": {
          if (!flowView) return;
          const { type, id } = data as FlowViewOnChangeDataNode;
          if (!type) flowView.node(id).hasError = true;
        }
        default:
          console.info(action, data, info);
      }
    },
    [flowView]
  );

  const onClickManage = useCallback(() => {
    router.push(route.strategyPage(strategyKey));
    setManageIsLoading(true);
  }, [router, setManageIsLoading, strategyKey]);

  const onClickSave = useCallback(() => {
    if (!flowLoaded) return;
    if (manageIsLoading) return;
    if (runIsLoading) return;
    if (saveIsLoading) return;
    if (!flowView) return;
    setNewStrategyFlow({ ...strategyKey, view: flowView.graph });
  }, [
    flowView,
    flowLoaded,
    manageIsLoading,
    runIsLoading,
    setNewStrategyFlow,
    strategyKey,
    saveIsLoading,
  ]);

  const onClickRun = useCallback(() => {
    if (!flowLoaded) return;
    if (manageIsLoading) return;
    if (saveIsLoading) return;
    if (typeof newStrategyFlow !== "undefined") return;
    setStrategyKeyToBeExecuted(strategyKey);
  }, [
    flowLoaded,
    manageIsLoading,
    newStrategyFlow,
    runIsLoading,
    saveIsLoading,
    setStrategyKeyToBeExecuted,
  ]);

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (typeof newStrategyFlow !== "undefined") return false;
    return true;
  }, [flowLoaded, newStrategyFlow]);

  const canSave = useMemo(() => {
    if (!flowLoaded) return false;
    return true;
  }, [flowLoaded]);

  useEffect(() => {
    if (!saveData) return;
    setNewStrategyFlow(undefined);
  }, [saveData, setNewStrategyFlow]);

  useEffect(() => {
    try {
      if (!storedStrategyFlow?.view) return;
      flowView?.loadGraph(storedStrategyFlow.view);
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow]);

  useEffect(() => {
    if (!strategyExecution) return;
    if (strategyExecution.status === "failure")
      toast.error("Strategy execution failure");
  }, [strategyExecution]);

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
            <Button isLoading={manageIsLoading} onClick={onClickManage}>
              manage
            </Button>
            <Button
              disabled={!canSave}
              isLoading={saveIsLoading}
              onClick={onClickSave}
            >
              save
            </Button>
            <Button
              disabled={!canRun}
              isLoading={runIsLoading}
              onClick={onClickRun}
            >
              run
            </Button>
          </menu>
        </div>

        <div className="w-full grow" ref={flowViewContainerRef}></div>
        <div className="my-2">memory</div>
      </div>
    </Content>
  );
};

export default Page;
