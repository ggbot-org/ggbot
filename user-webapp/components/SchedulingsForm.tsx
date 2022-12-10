import {
  StrategyScheduling,
  StrategySchedulings,
  isStrategyScheduling,
  isAccountStrategy,
  everyHour,
} from "@ggbot2/models";
import { Button, Section } from "@ggbot2/ui-components";
import {
  FC,
  ReactNode,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useApiAction } from "_hooks";
import type { StrategyKey } from "_routing";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";

type Props = {
  strategyKey: StrategyKey;
};

export const SchedulingsForm: FC<Props> = ({ strategyKey }) => {
  const [read, { data: accountStrategies, isPending: readIsPending }] =
    useApiAction.ReadAccountStrategies();
  const [create, { isPending: createIsPending, data: createData }] =
    useApiAction.CreateAccountStrategiesItemScheduling();
  const [remove, { isPending: removeIsPending, data: removeData }] =
    useApiAction.RemoveAccountStrategiesItemSchedulings();

  const updateIsPending = useMemo(
    () => createIsPending || removeIsPending,
    [createIsPending, removeIsPending]
  );

  const schedulings = useMemo<StrategySchedulings>(() => {
    const schedulings: StrategySchedulings = [];
    if (Array.isArray(accountStrategies)) {
      for (const accountStrategy of accountStrategies) {
        if (isAccountStrategy(accountStrategy)) {
          if (accountStrategy.strategyId === strategyKey.strategyId) {
            for (const scheduling of accountStrategy.schedulings) {
              schedulings.push(scheduling);
            }
          }
        }
      }
    }
    return schedulings;
  }, [accountStrategies]);

  // TODO by now only one scheduling
  const scheduling = useMemo<StrategyScheduling | undefined>(() => {
    const scheduling = schedulings[0];
    if (isStrategyScheduling(scheduling)) return scheduling;
  }, [schedulings]);

  const isActive = useMemo<boolean>(() => {
    if (!scheduling) return false;
    return scheduling.status === "active";
  }, [scheduling]);

  const actionButton = useMemo<ReactNode>(() => {
    if (isActive) return <Button isSpinning={updateIsPending}>dismiss</Button>;
    if (!isActive)
      return (
        <Button isSpinning={updateIsPending} color="primary">
          activate
        </Button>
      );
    return null;
  }, [isActive, updateIsPending]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (readIsPending || updateIsPending) return;
      if (isActive) {
        remove(strategyKey);
      } else {
        if (schedulings.length === 0) {
          create({
            ...strategyKey,
            frequency: everyHour(),
          });
        }
      }
    },
    [
      isActive,
      create,
      remove,
      updateIsPending,
      readIsPending,
      strategyKey,
      schedulings,
    ]
  );

  // Fetch accountStrategies on mount.
  useEffect(() => {
    const controller = read({});
    return () => {
      controller.abort();
    };
  }, [read]);

  // Fetch accountStrategies on updates.
  useEffect(() => {
    if (createData || removeData) read({});
  }, [read, createData, removeData]);

  return (
    <form onSubmit={onSubmit}>
      <Section header="Schedulings">
        <div>
          <SchedulingStatusBadge schedulings={schedulings} />
        </div>

        <menu className="flex flex-row flex-wrap gap-4">
          <li>{actionButton}</li>
        </menu>
      </Section>
    </form>
  );
};
