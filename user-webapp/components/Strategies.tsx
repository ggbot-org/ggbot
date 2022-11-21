import { Button, ButtonOnClick } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";
import { StrategyItem } from "./StrategyItem";

export const Strategies: FC = () => {
  const router = useRouter();

  const [newStrategyIsLoading, setNewStrategyIsLoading] = useState(false);

  const [readStrategies, { data: strategies }] =
    useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  const onClickNewStrategy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (newStrategyIsLoading) return;
      router.push(route.createStrategyPage());
      setNewStrategyIsLoading(true);
    },
    [newStrategyIsLoading, setNewStrategyIsLoading, router]
  );

  const noStrategy = useMemo(() => strategies === null, [strategies]);

  const strategyItems = useMemo(
    () =>
      strategies?.map(
        ({ name, schedulingStatus, strategyId, strategyKind }) => {
          return {
            name,
            schedulingStatus,
            strategyId,
            strategyKind,
          };
        }
      ),
    [strategies]
  );

  useEffect(readStrategies, [readStrategies]);

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl">strategies</h2>
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
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {noStrategy && <p>Your strategy list is empty.</p>}
        {strategyItems?.map(
          ({ name, strategyId, strategyKind, schedulingStatus }) => (
            <div className="lg:max-w-lg" key={strategyId}>
              <StrategyItem strategyKey={{ strategyId, strategyKind }}>
                <span>{name}</span>
                <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
              </StrategyItem>
            </div>
          )
        )}
      </div>
    </div>
  );
};
