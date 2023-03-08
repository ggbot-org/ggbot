import {
  Button,
  Buttons,
  ButtonOnClick,
  Checkbox,
  CheckboxOnChange,
  Columns,
  Column,
  Flex,
  Level,
} from "@ggbot2/design";
import Link from "next/link";
import { FC } from "react";
import { classNames } from "_classNames";
import { buttonLabel, checkboxLabel } from "_i18n";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name"> & {
  backtestingIsChecked?: boolean;
  canRun: boolean;
  canSave: boolean;
  hasBacktesting: boolean;
  liveIsChecked: boolean;
  onChangeBacktestingCheckbox: CheckboxOnChange;
  onChangeLiveCheckbox: CheckboxOnChange;
  onClickRun: ButtonOnClick;
  onClickSave: ButtonOnClick;
  runIsPending: boolean;
  saveIsPending: boolean;
};

export const EditStrategyTopbar: FC<Props> = ({
  backtestingIsChecked,
  canRun,
  canSave,
  hasBacktesting,
  liveIsChecked,
  name,
  onChangeBacktestingCheckbox,
  onChangeLiveCheckbox,
  onClickRun,
  onClickSave,
  runIsPending,
  saveIsPending,
  strategyKey,
}) => {
  return (
    <Columns className={classNames("is-marginless", { "has-background-warning-light": liveIsChecked })}>
      <Column className={classNames("p-0")}>
        <Flex>
          <Link
            href={route.strategyPage(strategyKey)}
            passHref
            tabIndex={0}
            className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
          >
            {name}
          </Link>
        </Flex>
      </Column>

      <Column isNarrow className={classNames("p-0")}>
        <Level
          isMobile
          className={classNames("is-marginless", "p-2")}
          left={
            <>
              {hasBacktesting && (
                <Checkbox
                  checked={backtestingIsChecked}
                  onChange={onChangeBacktestingCheckbox}
                  className={classNames("py-2", "px-1")}
                >
                  <span className={classNames("mx-2")}>{checkboxLabel.backtest}</span>
                </Checkbox>
              )}

              <Checkbox
                className={classNames("py-2", "px-1")}
                checked={liveIsChecked}
                onChange={onChangeLiveCheckbox}
              >
                <span className={classNames("mx-2")}>{checkboxLabel.live}</span>
              </Checkbox>
            </>
          }
          right={
            <Buttons>
              <Button color={canRun ? "warning" : undefined} isLoading={runIsPending} onClick={onClickRun}>
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
          <Flex className={classNames("p-4")}></Flex>
        </Level>
      </Column>
    </Columns>
  );
};
