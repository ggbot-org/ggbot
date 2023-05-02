import {
  Column,
  Columns,
  InputField,
  InputOnChange,
  SelectField,
  SelectOnChange,
} from "@ggbot2/design";
import { Frequency, isFrequencyInterval } from "@ggbot2/models";
import { NaturalNumber, isNaturalNumber } from "@ggbot2/type-utils";
import { FC, useCallback } from "react";

type FrequencyArg = Pick<Frequency, "interval"> & {
  every: NaturalNumber | "";
};

export type FrequencyInputProps = {
  frequency: FrequencyArg;
  setFrequency: (arg: FrequencyArg) => void;
};

const frequencyIntervalOptions = [
  {
    value: "1h",
    label: "hour",
  },
  { value: "1m", label: "minute" },
];

export const FrequencyInput: FC<FrequencyInputProps> = ({
  frequency: { interval, every },
  setFrequency,
}) => {
  const onChangeFrequencyEvery = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      const every = value === "" ? value : Number(value);
      if (isNaturalNumber(every) || every === "")
        setFrequency({
          interval,
          every,
        });
    },
    [interval, setFrequency]
  );

  const onChangeFrequencyInterval = useCallback<SelectOnChange>(
    (event) => {
      const value = event.target.value;
      if (isFrequencyInterval(value))
        setFrequency({
          every,
          interval: value,
        });
    },
    [every, setFrequency]
  );

  return (
    <Columns>
      <Column size={2}>
        <InputField
          label="every"
          value={every}
          onChange={onChangeFrequencyEvery}
          min={1}
          step={1}
        />
      </Column>

      <Column>
        <SelectField
          value={interval}
          onChange={onChangeFrequencyInterval}
          options={frequencyIntervalOptions}
          label="interval"
        />
      </Column>
    </Columns>
  );
};
