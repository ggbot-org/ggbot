import { Box, Buttons, Section, Title } from "@ggbot2/design";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { GoCopyStrategy } from "../components/GoCopyStrategy.js";
import { RenameStrategy } from "../components/RenameStrategy.js";
import { ShareStrategy } from "../components/ShareStrategy.js";
import { StrategyRecord } from "../components/StrategyRecord.js";
import { StrategyContext } from "../contexts/Strategy.js";

export const StrategyActions: FC = () => {
  const { strategy } = useContext(StrategyContext);

  return (
    <Box>
      <Section>
        <Title>
          <FormattedMessage id="StrategyActions.title" />
        </Title>

        <StrategyRecord strategy={strategy} />
      </Section>

      <Buttons>
        <RenameStrategy />

        <ShareStrategy />

        <GoCopyStrategy />

        <DeleteStrategy />
      </Buttons>
    </Box>
  );
};
