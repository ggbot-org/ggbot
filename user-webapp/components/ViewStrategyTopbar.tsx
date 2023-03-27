import { Buttons, Columns, Column, Flex, Level } from "@ggbot2/design";
import { FC } from "react";
import { classNames } from "_classNames";
import { StrategyInfo } from "_routing";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton";
import { ShareStrategyButton } from "./ShareStrategyButton";
import { StrategyFlowName } from "./StrategyFlowName";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name">;

export const ViewStrategyTopbar: FC<Props> = ({
  accountIsOwner,
  name,
  strategyKey,
}) => {
  return (
    <Columns className={classNames("is-marginless")}>
      <StrategyFlowName name={name} strategyKey={strategyKey} />

      <Column isNarrow className={classNames("p-0")}>
        <Level
          isMobile
          className={classNames("is-marginless", "p-2")}
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
