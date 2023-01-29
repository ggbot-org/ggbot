import {
  Frequency,
  StrategyScheduling,
  StrategySchedulings,
  everyHour,
  every15Minutes,
  isAccountStrategy,
  isStrategyScheduling,
} from "@ggbot2/models";
import {
  Button,
  Section,
  SelectField,
  SelectOnChange,
} from "@ggbot2/ui-components";
import {
  FC,
  ReactNode,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiAction, useSubscription } from "_hooks";
import { StrategyKey } from "_routing";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";

type Props = {
  strategyKey: StrategyKey;
  setHasActiveSubscription: (arg: boolean | undefined) => void;
};

export const SchedulingsForm: FC<Props> = ({
  setHasActiveSubscription,
  strategyKey,
}) => {
  const { strategyId } = strategyKey;

  const [selectedFrequencyKey, setSelectedFrequencyKey] = useState("1h");

  const frequencyOptions = useMemo(
    () => [
      {
        value: "1h",
        label: "every hour",
      },
      { value: "15m", label: "every 15 minutes" },
    ],
    []
  );

  const { hasActiveSubscription, readSubscriptionIsPending } =
    useSubscription();

  const [read, { data: accountStrategies, isPending: readIsPending }] =
    useApiAction.ReadAccountStrategies();
  const [create, { isPending: createIsPending, data: createData }] =
    useApiAction.CreateAccountStrategiesItemScheduling();
  const [remove, { isPending: removeIsPending, data: removeData }] =
    useApiAction.RemoveAccountStrategiesItemSchedulings();

  const disabled = useMemo(
    () => hasActiveSubscription === false,
    [hasActiveSubscription]
  );

  const actionIsPending = useMemo(
    () => readSubscriptionIsPending || createIsPending || removeIsPending,
    [createIsPending, removeIsPending, readSubscriptionIsPending]
  );

  const schedulings = useMemo<StrategySchedulings>(() => {
    const schedulings: StrategySchedulings = [];
    if (Array.isArray(accountStrategies)) {
      for (const accountStrategy of accountStrategies) {
        if (isAccountStrategy(accountStrategy)) {
          if (accountStrategy.strategyId === strategyId) {
            for (const scheduling of accountStrategy.schedulings) {
              schedulings.push(scheduling);
            }
          }
        }
      }
    }
    return schedulings;
  }, [accountStrategies, strategyId]);

  const frequency = useMemo<Frequency>(() => {
    if (selectedFrequencyKey === "15m") return every15Minutes();
    if (selectedFrequencyKey === "1h") return everyHour();
  }, [selectedFrequencyKey]);

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
    if (isActive)
      return (
        <Button disabled={disabled} isSpinning={actionIsPending}>
          dismiss
        </Button>
      );
    if (!isActive)
      return (
        <Button
          disabled={disabled}
          isSpinning={actionIsPending}
          color="primary"
        >
          activate
        </Button>
      );
    return null;
  }, [disabled, isActive, actionIsPending]);

  const onChangeFrequency = useCallback<SelectOnChange>(
    (event) => {
      setSelectedFrequencyKey(event.target.value);
    },
    [setSelectedFrequencyKey]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (disabled) return;
      if (readIsPending || actionIsPending) return;
      if (isActive) {
        remove(strategyKey);
      } else {
        if (schedulings.length === 0) {
          create({
            ...strategyKey,
            frequency,
          });
        }
      }
    },
    [
      isActive,
      create,
      frequency,
      remove,
      disabled,
      actionIsPending,
      readIsPending,
      strategyKey,
      schedulings,
    ]
  );

  useEffect(() => {
    if (typeof hasActiveSubscription === "boolean")
      setHasActiveSubscription(hasActiveSubscription);
  }, [hasActiveSubscription, setHasActiveSubscription]);

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
        <SelectField
          value={selectedFrequencyKey}
          onChange={onChangeFrequency}
          options={frequencyOptions}
          label="frequency"
        />

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
