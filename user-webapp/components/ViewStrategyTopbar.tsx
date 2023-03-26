import {
  Buttons,
  Checkbox,
  CheckboxOnChange,
  Columns,
  Column,
  Flex,
  Level,
} from "@ggbot2/design";
import { FC } from "react";
import { classNames } from "_classNames";
import { checkboxLabel } from "_i18n";
import { StrategyInfo } from "_routing";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton";
import { ShareStrategyButton } from "./ShareStrategyButton";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name"> & {
  backtestingIsChecked?: boolean;
  hasBacktesting: boolean;
  onChangeBacktestingCheckbox: CheckboxOnChange;
};

export const ViewStrategyTopbar: FC<Props> = ({
  accountIsOwner,
  backtestingIsChecked,
  hasBacktesting,
  name,
  onChangeBacktestingCheckbox,
  strategyKey,
}) => {
  return (
    <Columns className={classNames("is-marginless")}>
      <Column className={classNames("p-0")}>
        <Flex>
          <span
            className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
          >
            {name}
          </span>
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
                  <span className={classNames("mx-2")}>
                    {checkboxLabel.backtest}
                  </span>
                </Checkbox>
              )}
            </>
          }
          right={
            <Buttons>
              <ShareStrategyButton strategyKey={strategyKey} />

              {accountIsOwner || (
                <GoCopyStrategyButton strategyKey={strategyKey} />
              )}
            </Buttons>
          }
        >
          <Flex className={classNames("p-4")}></Flex>
        </Level>
      </Column>
    </Columns>
  );
};
