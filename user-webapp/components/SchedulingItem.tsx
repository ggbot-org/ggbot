import { StrategyScheduling, isFrequencyInterval } from "@ggbot2/models";
import { isNaturalNumber, NaturalNumber } from "@ggbot2/type-utils";
import {
  Button,
  ButtonOnClick,
  InputField,
  InputOnChange,
  SelectField,
  SelectOnChange,
} from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";

type FrequencyInput = Pick<StrategyScheduling["frequency"], "interval"> & {
  every: NaturalNumber | "";
};

export type SchedulingItemProps = {
  scheduling: Omit<StrategyScheduling, "frequency"> & {
    frequency: FrequencyInput;
  };
  setFrequency: (arg: FrequencyInput) => void;
  setStatus: (arg: Extract<StrategyScheduling["status"], "active" | "inactive">) => void;
  removeScheduling: () => void;
};

export const SchedulingItem: FC<SchedulingItemProps> = ({
  scheduling,
  setFrequency,
  removeScheduling,
  setStatus,
}) => {
  const { frequency, status } = scheduling;

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

  const onClickStatusButton = useCallback<ButtonOnClick>(() => {
    if (status !== "active") {
      setStatus("active");
    } else {
      setStatus("inactive");
    }
  }, [status, setStatus]);

  const statusButtonLabel = useMemo(() => {
    if (status !== "active") {
      return "Activate";
    } else {
      return "Dismiss";
    }
  }, [status]);

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
    <div className="flex flex-col gap-2">
      <menu className="flex flex-row flex-wrap items-center gap-4">
        <li>
          <SchedulingStatusBadge schedulingStatus={scheduling.status} />
        </li>

        <li>
          <Button onClick={removeScheduling}>Remove</Button>
        </li>

        <li>
          <Button onClick={onClickStatusButton}>{statusButtonLabel}</Button>
        </li>
      </menu>

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
    </div>
  );
};
