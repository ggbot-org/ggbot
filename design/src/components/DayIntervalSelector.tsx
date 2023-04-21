import { Day, isDay } from "@ggbot2/time";
import { FC, KeyboardEventHandler, useCallback } from "react";
import { Flex, InputOnChange } from "trunx";
import { InputField, InputFieldProps } from "./InputField";

export type DayIntervalSelectorProps = Pick<InputFieldProps, "min" | "max"> & {
  labelStart: InputFieldProps["label"];
  labelEnd: InputFieldProps["label"];
  start: Day;
  end: Day;
  setStart: (start: Day) => void;
  setEnd: (end: Day) => void;
};

export const DayIntervalSelector: FC<DayIntervalSelectorProps> = ({
  labelStart,
  labelEnd,
  min,
  max,
  start,
  end,
  setStart,
  setEnd,
}) => {
  // Disable keyboard, it can bypass min and max.
  const ignoreKeyboard = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const onChangeStart = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      if (!isDay(value)) return;
      if (value > end) return;
      setStart(value);
    },
    [setStart, end]
  );

  const onChangeEnd = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      if (!isDay(value)) return;
      if (value < start) return;
      setEnd(value);
    },
    [setEnd, start]
  );

  return (
    <Flex>
      <InputField
        type="date"
        value={start}
        label={labelStart}
        min={min}
        onChange={onChangeStart}
        onKeyDown={ignoreKeyboard}
      />

      <Flex spacing={{ mx: 1 }} />

      <InputField
        type="date"
        value={end}
        label={labelEnd}
        max={max}
        onChange={onChangeEnd}
        onKeyDown={ignoreKeyboard}
      />
    </Flex>
  );
};
