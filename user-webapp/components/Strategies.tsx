import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import {
  FC,
  PointerEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SchedulingStatusBadge } from "_components";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const Strategies: FC = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [newStrategyIsLoading, setNewStrategyIsLoading] = useState(false);

  const [readStrategies, { data: strategies }] =
    useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  const onClickNewStrategy = useCallback<
    PointerEventHandler<HTMLButtonElement>
  >(
    (event) => {
      event.stopPropagation();
      if (newStrategyIsLoading) return;
      router.push(route.createStrategyPage());
      setNewStrategyIsLoading(true);
    },
    [newStrategyIsLoading, setNewStrategyIsLoading, router]
  );

  const noStrategy = useMemo(() => strategies === null, [strategies]);

  const strategyItems = useMemo(() => {
    if (!strategies) return [];
    return strategies.map(
      ({ name, schedulingStatus, strategyId, strategyKind }) => {
        const onClick: PointerEventHandler<HTMLDivElement> = (event) => {
          event.stopPropagation();
          router.push(route.strategyPage({ strategyKind, strategyId }));
        };

        return {
          name,
          onClick,
          schedulingStatus,
          strategyId,
        };
      }
    );
  }, [strategies, router]);

  useEffect(readStrategies, [readStrategies]);

  return (
    <div ref={containerRef} className="flex flex-col p-4 gap-4">
      <span className="text-xl">strategies</span>
      <menu>
        <li>
          <Button
            isSpinning={newStrategyIsLoading}
            onClick={onClickNewStrategy}
          >
            new strategy
          </Button>
        </li>
      </menu>
      {noStrategy && <p>You have no strategy.</p>}
      <div className="flex flex-col flex-wrap gap-4">
        {strategyItems?.map(
          ({ strategyId, name, onClick, schedulingStatus }) => (
            <div
              key={strategyId}
              className="flex flex-row items-center justify-between gap-2"
              onClick={onClick}
            >
              <span className="select-none">{name}</span>
              <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
            </div>
          )
        )}
      </div>
    </div>
  );
};
