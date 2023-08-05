import { Button, ButtonProps, Buttons } from "@ggbot2/design";
import { FC, memo } from "react";
import { useIntl } from "react-intl";

import type {
  BacktestingOutput,
  BacktestingState,
} from "../hooks/useBacktesting.js";

const PauseButton: FC<ButtonProps> = (props) => {
  const { formatMessage } = useIntl();
  return (
    <Button {...props}>
      {formatMessage({ id: "BacktestingActions.pause" })}
    </Button>
  );
};

const ResumeButton: FC<ButtonProps> = (props) => {
  const { formatMessage } = useIntl();
  return (
    <Button {...props}>
      {formatMessage({ id: "BacktestingActions.resume" })}
    </Button>
  );
};

const StartButton: FC<ButtonProps> = (props) => {
  const { formatMessage } = useIntl();
  return (
    <Button {...props}>
      {formatMessage({ id: "BacktestingActions.start" })}
    </Button>
  );
};

const StopButton: FC<ButtonProps> = (props) => {
  const { formatMessage } = useIntl();
  return (
    <Button {...props}>
      {formatMessage({ id: "BacktestingActions.stop" })}
    </Button>
  );
};

type Props = Pick<BacktestingState, "isPaused" | "isRunning" | "isReadOnly"> &
  Pick<BacktestingOutput, "hasRequiredData"> & {
    onClickPause: ButtonProps["onClick"];
    onClickResume: ButtonProps["onClick"];
    onClickStart: ButtonProps["onClick"];
    onClickStop: ButtonProps["onClick"];
  };

export const BacktestingActions = memo<Props>(
  ({
    hasRequiredData,
    isPaused,
    isReadOnly,
    isRunning,
    onClickPause,
    onClickResume,
    onClickStart,
    onClickStop,
  }) => {
    if (isPaused)
      return (
        <Buttons>
          <StopButton onClick={onClickStop} />

          <ResumeButton onClick={onClickResume} />
        </Buttons>
      );

    if (isRunning)
      return (
        <Buttons>
          <StopButton onClick={onClickStop} />

          <PauseButton onClick={onClickPause} />
        </Buttons>
      );

    return (
      <StartButton
        onClick={hasRequiredData ? onClickStart : undefined}
        disabled={isReadOnly}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.hasRequiredData === nextProps.hasRequiredData &&
    prevProps.isPaused === nextProps.isPaused &&
    prevProps.isReadOnly === nextProps.isReadOnly &&
    prevProps.isRunning === nextProps.isRunning
);

BacktestingActions.displayName = "BacktestingActions";
