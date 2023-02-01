import { StrategyScheduling, isFrequencyInterval } from "@ggbot2/models";
import { isNaturalNumber, NaturalNumber } from "@ggbot2/type-utils";
import { Button, InputField, InputOnChange, SelectField, SelectOnChange } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";

type SchedulingInput = Omit<StrategyScheduling, "frequency"> & {
  frequency: Pick<StrategyScheduling["frequency"], "interval"> & {
    every: NaturalNumber | "";
  };
};

export type SchedulingControllerProps = {
  currentScheduling: StrategyScheduling;
  scheduling: SchedulingInput;
  setScheduling: (arg: SchedulingInput) => void;
};

export const SchedulingController: FC<SchedulingControllerProps> = ({ scheduling, setScheduling }) => {
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
      const every = value === "" ? value : Number(value);
      if (isNaturalNumber(every) || every === "")
        setScheduling({
          ...scheduling,
          frequency: {
            ...scheduling.frequency,
            every,
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
      <div className="flex flex-row gap-1">
        <div className="w-16">
          <InputField
            label="every"
            value={frequency.every}
            onChange={onChangeFrequencyEvery}
            min={1}
            step={1}
          />
        </div>

        <SelectField
          value={frequency.interval}
          onChange={onChangeFrequencyInterval}
          options={frequencyIntervalOptions}
          label="interval"
        />
      </div>

      <menu className="flex flex-row flex-wrap gap-4">
        <li>
          <Button>Remove</Button>
        </li>

        <li>
          <Button>Dismiss</Button>
        </li>
      </menu>
    </fieldset>
  );
};
