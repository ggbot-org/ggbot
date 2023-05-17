import { classNames } from "_classNames";
import { StrategyFlowName } from "_components/StrategyFlowName";
import { buttonLabel } from "_i18n";
import { StrategyInfo } from "_routing/types";
import {
  Button,
  ButtonOnClick,
  Buttons,
  Column,
  Columns,
  Flex,
  Level,
} from "@ggbot2/design";
import { FC } from "react";

type Props = Pick<StrategyInfo, "strategyKey" | "name"> & {
  canRun: boolean;
  canSave: boolean;
  onClickRun: ButtonOnClick;
  onClickSave: ButtonOnClick;
  runIsPending: boolean;
  saveIsPending: boolean;
};

export const EditStrategyTopbar: FC<Props> = ({
  canRun,
  canSave,
  name,
  onClickRun,
  onClickSave,
  runIsPending,
  saveIsPending,
  strategyKey,
}) => (
  <Columns className={classNames("is-marginless")}>
    <StrategyFlowName name={name} strategyKey={strategyKey} />

    <Column isNarrow className={classNames("p-0")}>
      <Level
        isMobile
        className={classNames("is-marginless", "p-2")}
        right={
          <Buttons>
            <Button
              color={canRun || runIsPending ? "warning" : undefined}
              isLoading={runIsPending}
              onClick={onClickRun}
            >
              {buttonLabel.run}
            </Button>

            <Button
              color={canSave ? "primary" : undefined}
              isLoading={saveIsPending}
              onClick={onClickSave}
            >
              {buttonLabel.save}
            </Button>
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
