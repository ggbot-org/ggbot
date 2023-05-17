import { classNames } from "_classNames";
import { GoCopyStrategyButton } from "_components/GoCopyStrategyButton";
import { ShareStrategyButton } from "_components/ShareStrategyButton";
import { StrategyFlowName } from "_components/StrategyFlowName";
import { StrategyInfo } from "_routing/types";
import { Buttons, Column, Columns, Flex, Level } from "@ggbot2/design";
import { FC } from "react";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name">;

export const ViewStrategyTopbar: FC<Props> = ({
  accountIsOwner,
  name,
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
            <ShareStrategyButton
              strategyKey={strategyKey}
              strategyName={name}
            />

            {accountIsOwner || (
              <GoCopyStrategyButton strategyKey={strategyKey} />
            )}
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
