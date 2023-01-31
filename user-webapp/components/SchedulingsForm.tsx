import {
  Frequency,
  FrequencyInterval,
  StrategyScheduling,
  StrategySchedulings,
  isAccountStrategy,
  isStrategyScheduling,
  isFrequencyInterval,
} from "@ggbot2/models";
import { isNaturalNumber, NaturalNumber } from "@ggbot2/type-utils";
import {
  Button,
  InputField,
  InputOnChange,
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
import { SchedulingsStatusBadge } from "./SchedulingsStatusBadge";

type Props = {
  strategyKey: StrategyKey;
  setHasActiveSubscription: (arg: boolean | undefined) => void;
};

export const SchedulingsForm: FC<Props> = ({
  setHasActiveSubscription,
  strategyKey,
}) => {
  const { strategyId } = strategyKey;

  const { hasActiveSubscription } = useSubscription();

  const [read, { data: accountStrategies, isPending: readIsPending }] =
    useApiAction.ReadAccountStrategies();
  // const [create, { isPending: createIsPending, data: createData }] =
  //   useApiAction.CreateAccountStrategiesItemScheduling();
  // const [remove, { isPending: removeIsPending, data: removeData }] =
  //   useApiAction.RemoveAccountStrategiesItemSchedulings();

  const disabled = useMemo(
    () => hasActiveSubscription !== true,
    [hasActiveSubscription]
  );

  const schedulings = useMemo<StrategySchedulings | undefined>(() => {
    if (!Array.isArray(accountStrategies)) return;
    const schedulings: StrategySchedulings = [];
    for (const accountStrategy of accountStrategies) {
      if (isAccountStrategy(accountStrategy)) {
        if (accountStrategy.strategyId === strategyId) {
          for (const scheduling of accountStrategy.schedulings) {
            schedulings.push(scheduling);
          }
        }
      }
    }
    return schedulings;
  }, [accountStrategies, strategyId]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (disabled) return;
    },
    [disabled]
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
  useEffect(
    () => {
      // if (createData || removeData) read({});
    },
    [
      /*read, createData, removeData*/
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <Section header="Schedulings">
        <div>
          <SchedulingsStatusBadge schedulings={schedulings} />
        </div>

        <div>
          {Array.isArray(schedulings)
            ? schedulings.map((scheduling) => (
                <SchedulingController
                  scheduling={scheduling}
                  setScheduling={() => {}}
                />
              ))
            : null}
        </div>

        <menu className="flex flex-row flex-wrap gap-4">
          <li>
            <Button>Save</Button>
          </li>
        </menu>
      </Section>
    </form>
  );
};

type SchedulingControllerProps = {
  scheduling: StrategyScheduling;
  setScheduling: (arg: StrategyScheduling) => void;
};

export const SchedulingController: FC<SchedulingControllerProps> = ({
  scheduling,
  setScheduling,
}) => {
  const { frequency } = scheduling;

  const frequencyIntervalOptions = useMemo(
    () => [
      {
        value: "1h",
        label: "hour",
      },
      { value: "1m", label: "minute" },
    ],
    []
  );

  const onChangeFrequencyEvery = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      if (isNaturalNumber(value))
        setScheduling({
          ...scheduling,
          frequency: {
            ...scheduling.frequency,
            every: value,
          },
        });
    },
    [scheduling, setScheduling]
  );

  const onChangeFrequencyInterval = useCallback<SelectOnChange>(
    (event) => {
      const value = event.target.value;
      if (isFrequencyInterval(value))
        setScheduling({
          ...scheduling,
          frequency: {
            ...scheduling.frequency,
            interval: value,
          },
        });
    },
    [scheduling, setScheduling]
  );

  return (
    <fieldset>
      <InputField
        label="every"
        value={frequency.every}
        onChange={onChangeFrequencyEvery}
        min={1}
        step={1}
      />

      <SelectField
        value={frequency.interval}
        onChange={onChangeFrequencyInterval}
        options={frequencyIntervalOptions}
        label="interval"
      />

      <menu className="flex flex-row flex-wrap gap-4">
        <li>
          <Button>dismiss</Button>
        </li>
      </menu>
    </fieldset>
  );
};
