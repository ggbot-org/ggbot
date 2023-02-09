import { Frequency, isFrequencyInterval } from "@ggbot2/models";
import { NaturalNumber, isNaturalNumber } from "@ggbot2/type-utils";
import { InputField, InputOnChange, SelectField, SelectOnChange } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";

type FrequencyArg = Pick<Frequency, "interval"> & {
  every: NaturalNumber | "";
};

export type FrequencyInputProps = {
  frequency: FrequencyArg;
  setFrequency: (arg: FrequencyArg) => void;
};

export const FrequencyInput: FC<FrequencyInputProps> = ({ frequency, setFrequency }) => {
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
        setFrequency({
          ...scheduling.frequency,
          every,
        });
    },
    [scheduling, setFrequency]
  );

  const onChangeFrequencyInterval = useCallback<SelectOnChange>(
    (event) => {
      const value = event.target.value;
      if (isFrequencyInterval(value))
        setFrequency({
          ...scheduling.frequency,
          interval: value,
        });
    },
    [scheduling, setFrequency]
  );

  return (
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
  );
};
