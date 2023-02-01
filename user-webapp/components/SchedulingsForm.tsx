import { StrategyScheduling, isAccountStrategy } from "@ggbot2/models";
import { Button, Section } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction, useSubscription } from "_hooks";
import { StrategyKey } from "_routing";
import { SchedulingsStatusBadge } from "./SchedulingsStatusBadge";
import { SchedulingController, SchedulingControllerProps } from "./SchedulingController";
import { isNaturalNumber } from "@ggbot2/type-utils";

type Props = {
  strategyKey: StrategyKey;
  setHasActiveSubscription: (arg: boolean | undefined) => void;
};

export const SchedulingsForm: FC<Props> = ({ setHasActiveSubscription, strategyKey }) => {
  const { strategyId } = strategyKey;

  const { hasActiveSubscription } = useSubscription();

  const [read, { data: accountStrategies }] = useApiAction.ReadAccountStrategies();
  const [_update, { isPending: updateIsPending }] = useApiAction.UpdateAccountStrategiesItem();

  const [changedSchedulings, setChangedSchedulings] = useState<SchedulingControllerProps["scheduling"][]>(
    []
  );

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
    // No change at all.
    if (changedSchedulings.length === 0) return false;
    // Some scheduling was added or removed.
    if (changedSchedulings.length !== currentSchedulings.length) return true;
    // Some scheduling value changed.
    return currentSchedulings.some((scheduling) => {
      const changedScheduling = changedSchedulings.find(({ id }) => scheduling.id === id);
      if (!changedScheduling) return false;
      return (
        changedScheduling.frequency.every !== scheduling.frequency.every ||
        changedScheduling.frequency.interval !== scheduling.frequency.interval
      );
    });
  }, [changedSchedulings, currentSchedulings]);

  const everyChangedSchedulingIsValid = useMemo(() => {
    return changedSchedulings.every(({ frequency: { every } }) => {
      return isNaturalNumber(every);
    });
  }, [changedSchedulings]);

  const canSubmit = useMemo(() => {
    if (hasActiveSubscription !== true) return false;
    if (someSchedulingChanged) return everyChangedSchedulingIsValid;
    return false;
  }, [someSchedulingChanged, hasActiveSubscription, everyChangedSchedulingIsValid]);

  const schedulingItems = useMemo<
    Pick<SchedulingControllerProps, "scheduling" | "currentScheduling">[]
  >(() => {
    return currentSchedulings.map((currentScheduling) => {
      const changedScheduling = changedSchedulings.find(
        (schedulingChange) => schedulingChange.id === currentScheduling.id
      );
      return {
        currentScheduling,
        scheduling: changedScheduling ?? currentScheduling,
      };
    });
  }, [currentSchedulings, changedSchedulings]);

  const setScheduling = useCallback<SchedulingControllerProps["setScheduling"]>(
    (scheduling) => {
      setChangedSchedulings((schedulingChanges) =>
        schedulingChanges
          .filter((changedScheduling) => changedScheduling.id !== scheduling.id)
          .concat(scheduling)
      );
    },
    [setChangedSchedulings]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (!canSubmit) return;
    },
    [canSubmit]
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

  // Fetch accountStrategies on updates.
  useEffect(
    () => {
      // if (createData || removeData) read({});
    },
    [
      /*read, createData, removeData*/
    ]
  );

  return (
    <Section
      header={
        <div className="flex flex-row justify-between">
          <span>Schedulings</span>

          <div>
            <SchedulingsStatusBadge schedulings={currentSchedulings} />
          </div>
        </div>
      }
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {schedulingItems.map(({ currentScheduling, scheduling }) => (
              <SchedulingController
                key={scheduling.id}
                currentScheduling={currentScheduling}
                scheduling={scheduling}
                setScheduling={setScheduling}
              />
            ))}
          </div>

          <menu className="flex flex-row flex-wrap gap-4">
            <li>
              <Button>Add</Button>
            </li>
          </menu>

          <menu className="flex flex-row flex-wrap gap-4">
            <li>
              <Button type="submit" disabled={!canSubmit} isSpinning={updateIsPending}>
                Save
              </Button>
            </li>
          </menu>
        </div>
      </form>
    </Section>
  );
};
