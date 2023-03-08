import { Button, Buttons, ButtonOnClick, Checkbox, Column, Columns } from "@ggbot2/design";
import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { isStrategyFlow } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useEffect, useCallback, useMemo, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { classNames } from "_classNames";
import { BacktestController, ButtonShareStrategy, Navigation, Page } from "_components";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import { buttonLabel, checkboxLabel } from "_i18n";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
  hasSession: boolean;
};

export const ViewStrategyFlowPage: FC<Props> = ({
  accountIsOwner,
  binanceSymbols,
  hasSession,
  name: strategyName,
  strategyKey,
}) => {
  const router = useRouter();

  const { strategyKind } = strategyKey;

  const [copyIsSpinning, setCopyIsSpinning] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    ...strategyKey,
    binanceSymbols,
    flowViewGraph: flowView?.graph,
  });

  const [readStrategyFlow, { data: storedStrategyFlow, isPending: readIsPending }] =
    useApiAction.ReadStrategyFlow();

  const strategyPathname = useMemo(() => route.viewFlowPage(strategyKey), [strategyKey]);

  const onChangeBacktestingCheckbox = useCallback(() => {
    backtestingDispatch({ type: "TOGGLE" });
  }, [backtestingDispatch]);

  const onClickCopy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (copyIsSpinning) return;
      setCopyIsSpinning(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [copyIsSpinning, setCopyIsSpinning, router, strategyKey]
  );

  useEffect(() => {
    if (!flowLoaded) readStrategyFlow(strategyKey);
  }, [flowLoaded, readStrategyFlow, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (readIsPending) return;
      if (storedStrategyFlow === undefined) return;
      if (storedStrategyFlow === null) {
        setFlowLoaded(true);
        return;
      }
      flowView.clearGraph();
      if (isStrategyFlow(storedStrategyFlow)) {
        flowView.loadGraph(storedStrategyFlow.view);
      }
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, readIsPending]);

  return (
    <Page
      metadata={{
        title: "ggbot2 strategy",
        description: strategyName,
        canonical: strategyPathname,
      }}
      topbar={<Navigation noMenu={!hasSession} />}
    >
      <Columns>
        <Column>
          <dl>
            <dt>name</dt>
            <dd>{strategyName}</dd>
          </dl>
        </Column>

        <Column>
          <Buttons>
            {backtesting && (
              <Checkbox
                checked={backtesting.isEnabled}
                onChange={onChangeBacktestingCheckbox}
                className={classNames("py-2", "px-1")}
              >
                <span className={classNames("mx-2")}>{checkboxLabel.backtest}</span>
              </Checkbox>
            )}

            <ButtonShareStrategy {...strategyKey} />

            {accountIsOwner || (
              <Button color="primary" isLoading={copyIsSpinning} onClick={onClickCopy}>
                {buttonLabel.copy}
              </Button>
            )}
          </Buttons>
        </Column>
      </Columns>

      <BacktestController state={backtesting} dispatch={backtestingDispatch} view={flowView?.graph} />

      <div ref={flowViewContainerRef}></div>
    </Page>
  );
};
