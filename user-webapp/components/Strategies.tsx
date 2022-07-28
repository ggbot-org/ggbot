import { StrategyKey, isStrategyKey } from "@ggbot2/models";
import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useCallback, useMemo, useState } from "react";
import { SchedulingStatusBadge, StrategyActions } from "_components";
import { useApiAction } from "_hooks";
import { route } from "_routing";

type SelectedStrategyKey = StrategyKey | null;
const selectedStrategyKeyStorageKey = "selectedStrategyKey";

const getStoredSelectedStrategy = (): SelectedStrategyKey => {
  const storedValue = global?.sessionStorage?.getItem(
    selectedStrategyKeyStorageKey
  );
  if (!storedValue) return null;
  const objValue = JSON.parse(storedValue);
  return isStrategyKey(objValue) ? objValue : null;
};

const setStoredSelectedStrategyKey = (
  selectedStrategyKey: SelectedStrategyKey
) => {
  if (selectedStrategyKey)
    global?.sessionStorage?.setItem(
      selectedStrategyKeyStorageKey,
      JSON.stringify(selectedStrategyKey)
    );
  else global?.sessionStorage?.removeItem(selectedStrategyKeyStorageKey);
};

export const Strategies: FC = () => {
  const router = useRouter();

  const [selectedStrategyKey, setSelectedStrategyKey] =
    useState<SelectedStrategyKey>(getStoredSelectedStrategy());

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
              setStoredSelectedStrategyKey({ strategyId, strategyKind });
              setSelectedStrategyKey({ strategyId, strategyKind });
            },
            schedulingStatus,
            strategyKind,
            strategyId,
          };
        }
      ),
    [selectedStrategyKey, setSelectedStrategyKey, strategies]
  );

  const onClickContainer = useCallback(() => {
    setStoredSelectedStrategyKey(null);
    setSelectedStrategyKey(null);
  }, [setSelectedStrategyKey]);

  return (
    <div className="p-4 flex flex-col gap-4" onClick={onClickContainer}>
      <span className="text-xl">strategies</span>
      <menu>
        <Button onClick={onClickNewStrategy}>new strategy</Button>
      </menu>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
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
              className="flex flex-col gap-4 shadow p-2 hover:shadow-md transition-all"
              key={strategyId}
            >
              <div
                className="flex flex-row justify-between gap-2 items-center"
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
