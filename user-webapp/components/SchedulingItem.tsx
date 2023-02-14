import { Button, ButtonOnClick } from "@ggbot2/design";
import { StrategyScheduling } from "@ggbot2/models";
import { FC, useCallback, useMemo } from "react";
import { FrequencyInput, FrequencyInputProps } from "./FrequencyInput";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";

export type SchedulingItemProps = Pick<FrequencyInputProps, "setFrequency"> & {
  scheduling: Omit<StrategyScheduling, "frequency"> & Pick<FrequencyInputProps, "frequency">;
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

      <FrequencyInput frequency={frequency} setFrequency={setFrequency} />
    </div>
  );
};
