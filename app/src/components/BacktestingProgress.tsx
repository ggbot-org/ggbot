import {
  Box,
  dayFormat,
  Flex,
  Progress,
  ProgressProps,
  timeFormat,
  Title,
} from "@ggbot2/design";
import { Timestamp } from "@ggbot2/time";
import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { BacktestingState } from "../hooks/useBacktesting";

export type BacktestingProgressProps = Pick<BacktestingState, "dayInterval"> & {
  progress: Pick<ProgressProps, "value" | "max"> | undefined;
  timestamp: Timestamp | undefined;
};

export const BacktestingProgress: FC<BacktestingProgressProps> = ({
  dayInterval,
  progress,
  timestamp,
}) => {
  const { formatDate } = useIntl();

  return (
    <Box>
      <Title>
        <FormattedMessage id="BacktestingProgress.title" />
      </Title>

      {progress ? (
        <>
          <Progress {...progress} />

          <FormattedMessage
            id="BacktestingProgress.intervals"
            values={progress}
          />
        </>
      ) : (
        <>
          <Progress value={undefined} />

          <FormattedMessage
            id="BacktestingProgress.waiting"
            values={progress}
          />
        </>
      )}

      <Flex direction="column" spacing={{ my: 2 }}>
        <Flex>
          <FormattedMessage
            id="BacktestingProgress.dayInterval"
            values={{
              start: formatDate(dayInterval.start, dayFormat),
              end: formatDate(dayInterval.end, dayFormat),
            }}
          />
        </Flex>

        {timestamp ? (
          <Flex>
            <FormattedMessage
              id="BacktestingProgress.currentTime"
              values={{
                time: formatDate(timestamp, timeFormat),
              }}
            />
          </Flex>
        ) : null}
      </Flex>
    </Box>
  );
};
