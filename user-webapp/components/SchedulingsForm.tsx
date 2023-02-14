import { Button, ButtonOnClick, Section } from "@ggbot2/design";
import {
  StrategyScheduling,
  isAccountStrategy,
  isStrategyScheduling,
  newStrategyScheduling,
} from "@ggbot2/models";
import { FC, FormEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction, useSubscription } from "_hooks";
import { StrategyKey } from "_routing";
import { SchedulingItem, SchedulingItemProps } from "./SchedulingItem";
import { SchedulingsStatusBadges } from "./SchedulingsStatusBadges";

type Props = {
  strategyKey: StrategyKey;
  setHasActiveSubscription: (arg: boolean | undefined) => void;
};

export const SchedulingsForm: FC<Props> = ({ setHasActiveSubscription, strategyKey }) => {
  const { strategyId } = strategyKey;

  const { hasActiveSubscription } = useSubscription();

  const [read, { data: accountStrategies }] = useApiAction.ReadAccountStrategies();
  const [write, { isPending: writeIsPending, data: writeData }] =
    useApiAction.WriteAccountStrategiesItemSchedulings();

  const [schedulingItems, setSchedulingItems] = useState<SchedulingItemProps["scheduling"][]>([]);

  const currentSchedulings = useMemo<StrategyScheduling[]>(() => {
    if (!Array.isArray(accountStrategies)) return [];
    const schedulings: StrategyScheduling[] = [];
    for (const accountStrategy of accountStrategies) {
      if (!isAccountStrategy(accountStrategy)) continue;
      if (accountStrategy.strategyId !== strategyId) continue;
      schedulings.push(...accountStrategy.schedulings);
    }
    return schedulings;
  }, [accountStrategies, strategyId]);

  const someSchedulingChanged = useMemo(() => {
    // Do not know about currentSchedulings yet, data fetch is pending.
    if (!currentSchedulings) return false;
    // Some scheduling for sure was added or removed.
    if (schedulingItems.length !== currentSchedulings.length) return true;
    // Here the number of schedulingItem and currentSchedulings is the same.
    // Check every schedulingItem:
    for (const schedulingItem of schedulingItems) {
      const currentScheduling = currentSchedulings.find(({ id }) => schedulingItem.id === id);
      // if there is no corresponding currentScheduling, it is a new item;
      if (!currentScheduling) return true;
      // check if schedulingItem is valid, and some of its attribute changed.
      if (
        isStrategyScheduling(schedulingItem) &&
        (schedulingItem.status !== currentScheduling.status ||
          schedulingItem.frequency.every !== currentScheduling.frequency.every ||
          schedulingItem.frequency.interval !== currentScheduling.frequency.interval)
      )
        return true;
    }
    return false;
  }, [currentSchedulings, schedulingItems]);

  const wantedSchedulings = useMemo<StrategyScheduling[]>(() => {
    return schedulingItems.filter(isStrategyScheduling);
  }, [schedulingItems]);

  const canSubmit = useMemo(() => {
    if (hasActiveSubscription !== true) return false;
    return someSchedulingChanged && schedulingItems.every(isStrategyScheduling);
  }, [someSchedulingChanged, hasActiveSubscription, schedulingItems]);

  const canCancel = useMemo(() => {
    return someSchedulingChanged;
  }, [someSchedulingChanged]);

  const setSchedulingItemFrequency = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["setFrequency"]
  >(
    (id) => (frequency) => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.map((schedulingItem) => {
          if (schedulingItem.id !== id) return schedulingItem;
          return { ...schedulingItem, frequency };
        })
      );
    },
    []
  );

  const setSchedulingItemStatus = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["setStatus"]
  >(
    (id) => (status) => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.map((schedulingItem) => {
          if (schedulingItem.id !== id) return schedulingItem;
          return { ...schedulingItem, status };
        })
      );
    },
    []
  );

  const removeSchedulingItem = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["removeScheduling"]
  >(
    (id) => () => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.filter((schedulingItem) => schedulingItem.id !== id)
      );
    },
    []
  );

  const addSchedulingItem = useCallback(() => {
    setSchedulingItems((schedulingItems) =>
      schedulingItems.concat(
        newStrategyScheduling({ frequency: { every: 1, interval: "1h" }, status: "inactive" })
      )
    );
  }, []);

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!canSubmit) return;
    write({ strategyId, schedulings: wantedSchedulings });
  }, [canSubmit, strategyId, wantedSchedulings, write]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
    event.preventDefault();
  }, []);

  const onClickCancel = useCallback<ButtonOnClick>(
    (event) => {
      event.preventDefault();
      setSchedulingItems(currentSchedulings);
    },
    [currentSchedulings]
  );

  useEffect(() => {
    if (typeof hasActiveSubscription === "boolean") setHasActiveSubscription(hasActiveSubscription);
  }, [hasActiveSubscription, setHasActiveSubscription]);

  // Fetch accountStrategies on mount.
  useEffect(() => {
    const controller = read({});
    return () => {
      controller.abort();
    };
  }, [read]);

  // Update schedulings once fetched.
  useEffect(() => {
    if (currentSchedulings) setSchedulingItems(currentSchedulings);
  }, [currentSchedulings]);

  // Fetch accountStrategies on updates.
  useEffect(() => {
    if (writeData) read({});
  }, [writeData, read]);

  return (
    <Section header="Schedulings">
      <SchedulingsStatusBadges schedulings={currentSchedulings} />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {schedulingItems.map((scheduling) => {
              const { id } = scheduling;
              return (
                <SchedulingItem
                  key={id}
                  scheduling={scheduling}
                  setFrequency={setSchedulingItemFrequency(id)}
                  setStatus={setSchedulingItemStatus(id)}
                  removeScheduling={removeSchedulingItem(id)}
                />
              );
            })}
          </div>

          <menu className="flex flex-row flex-wrap gap-4">
            <li>
              <Button onClick={addSchedulingItem}>Add</Button>
            </li>
          </menu>

          <menu className="flex flex-row flex-wrap gap-4">
            <li>
              <Button onClick={onClickSave} disabled={!canSubmit} isSpinning={writeIsPending}>
                Save
              </Button>
            </li>

            <li>
              <Button onClick={onClickCancel} disabled={!canCancel}>
                Cancel
              </Button>
            </li>
          </menu>
        </div>
      </form>
    </Section>
  );
};
