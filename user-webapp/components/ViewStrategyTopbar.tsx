import {
  Button,
  Buttons,
  Checkbox,
  CheckboxOnChange,
  Columns,
  Column,
  Flex,
  Level,
  ButtonOnClick,
} from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { classNames } from "_classNames";
import { buttonLabel, checkboxLabel } from "_i18n";
import { StrategyInfo, route } from "_routing";
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
  const router = useRouter();

  const [copyIsSpinning, setCopyIsSpinning] = useState(false);

  const onClickCopy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (copyIsSpinning) return;
      setCopyIsSpinning(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [copyIsSpinning, setCopyIsSpinning, router, strategyKey]
  );

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
              <ShareStrategyButton {...strategyKey} />

              {accountIsOwner || (
                <Button
                  color="primary"
                  isLoading={copyIsSpinning}
                  onClick={onClickCopy}
                >
                  {buttonLabel.copy}
                </Button>
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
