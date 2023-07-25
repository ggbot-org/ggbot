import { Column, Columns, Content, Message, OutputField } from "@ggbot2/design";
import { StrategyKey } from "@ggbot2/models";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = StrategyKey;

export const StrategyNotFound: FC<Props> = ({ strategyId, strategyKind }) => {
  const { formatMessage } = useIntl();

  return (
    <Message
      color="warning"
      header={formatMessage({ id: "StrategyNotFound.title" })}
    >
      <Content>
        <Columns>
          <Column>
            <OutputField
              label={formatMessage({ id: "fieldLabel.strategyKind" })}
              value={strategyKind}
            />
          </Column>

          <Column>
            <OutputField
              label={formatMessage({ id: "fieldLabel.strategyId" })}
              value={strategyId}
            />
          </Column>
        </Columns>
      </Content>
    </Message>
  );
};
