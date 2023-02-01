import { StrategyScheduling, isFrequencyInterval } from "@ggbot2/models";
import { isNaturalNumber } from "@ggbot2/type-utils";
import {
  Button,
  InputField,
  InputOnChange,
  SelectField,
  SelectOnChange,
} from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";

export type SchedulingControllerProps = {
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
          <Button>remove</Button>
        </li>
      </menu>
    </fieldset>
  );
};
