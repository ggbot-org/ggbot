import { Button, ButtonOnClick, Buttons } from "@ggbot2/design";
import { StrategyScheduling } from "@ggbot2/models";
import { FC, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  FrequencyInput,
  FrequencyInputProps,
} from "../components/FrequencyInput.js";
import { SchedulingStatus } from "../components/SchedulingStatus.js";

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
  const { formatMessage } = useIntl();

  const { frequency, status } = scheduling;

  const onClickStatusButton = useCallback<ButtonOnClick>(() => {
    if (status !== "active") {
      setStatus("active");
    } else {
      setStatus("inactive");
    }
  }, [status, setStatus]);

  const statusButtonLabel =
    status === "active"
      ? formatMessage({ id: "SchedulingItem.dismiss" })
      : formatMessage({ id: "SchedulingItem.activate" });

  return (
    <div>
      <SchedulingStatus status={scheduling.status} />

      <FrequencyInput frequency={frequency} setFrequency={setFrequency} />

      <Buttons size="small">
        <Button onClick={removeScheduling}>
          <FormattedMessage id="SchedulingItem.remove" />
        </Button>

        <Button onClick={onClickStatusButton}>{statusButtonLabel}</Button>
      </Buttons>
    </div>
  );
};
