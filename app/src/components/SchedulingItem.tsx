import {
  FrequencyInput,
  FrequencyInputProps,
} from "_components/FrequencyInput";
import { SchedulingStatusBadge } from "_components/SchedulingStatusBadge";
import { buttonLabel } from "_i18n";
import { Button, ButtonOnClick, Buttons } from "@ggbot2/design";
import { StrategyScheduling } from "@ggbot2/models";
import { FC, useCallback } from "react";

export type SchedulingItemProps = Pick<FrequencyInputProps, "setFrequency"> & {
  scheduling: Omit<StrategyScheduling, "frequency"> &
    Pick<FrequencyInputProps, "frequency">;
  setStatus: (
    arg: Extract<StrategyScheduling["status"], "active" | "inactive">
  ) => void;
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

  const statusButtonLabel =
    status === "active" ? buttonLabel.dismiss : buttonLabel.activate;

  return (
    <div>
      <SchedulingStatusBadge schedulingStatus={scheduling.status} />

      <FrequencyInput frequency={frequency} setFrequency={setFrequency} />

      <Buttons size="small">
        <Button onClick={removeScheduling}>{buttonLabel.remove}</Button>

        <Button onClick={onClickStatusButton}>{statusButtonLabel}</Button>
      </Buttons>
    </div>
  );
};
