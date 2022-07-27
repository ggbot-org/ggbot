import { StrategyKey } from "@ggbot2/models";
import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useCallback, useMemo, useState } from "react";
import { SchedulingStatusBadge, StrategyActions } from "_components";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const Strategies: FC = () => {
  const router = useRouter();

  const [selectedStrategyKey, setSelectedStrategyKey] = useState<
    StrategyKey | undefined
  >();

  const { data: strategies } = useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  const onClickNewStrategy = useCallback(() => {
    router.push(route.createStrategyPage());
  }, [router]);

  const strategyItems = useMemo(
    () =>
      strategies?.map(
        ({ name, schedulingStatus, strategyId, strategyKind }) => {
          const isSelected =
            selectedStrategyKey?.strategyId === strategyId &&
            selectedStrategyKey?.strategyKind === strategyKind;

          return {
            isSelected,
            name,
            onClick: (event: SyntheticEvent) => {
              event.stopPropagation();
              setSelectedStrategyKey(
                isSelected ? undefined : { strategyId, strategyKind }
              );
            },
            schedulingStatus,
            strategyKind,
            strategyId,
          };
        }
      ),
    [selectedStrategyKey, setSelectedStrategyKey, strategies]
  );

  return (
    <div
      className="p-4 flex flex-col gap-4"
      onClick={() => {
        setSelectedStrategyKey(undefined);
      }}
    >
      <span className="text-xl">strategies</span>
      <menu>
        <Button onClick={onClickNewStrategy}>new strategy</Button>
      </menu>
      <div className="flex flex-row gap-4 flex-wrap">
        {strategyItems?.map(
          ({
            name,
            onClick,
            isSelected,
            schedulingStatus,
            strategyId,
            strategyKind,
          }) => (
            <div
              className="flex flex-col gap-4 h-fit shadow p-2 hover:shadow-md transition-all"
              key={strategyId}
            >
              <div
                className="flex flex-row justify-between gap-2 items-center cursor-pointer"
                onClick={onClick}
              >
                <span>{name}</span>
                <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
              </div>
              {isSelected ? (
                <StrategyActions
                  strategyId={strategyId}
                  strategyKind={strategyKind}
                />
              ) : null}
            </div>
          )
        )}
      </div>
    </div>
  );
};
