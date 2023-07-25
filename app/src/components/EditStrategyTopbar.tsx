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
import { FormattedMessage } from "react-intl";

import { classNames } from "../styles/classNames.js";

type Props = {
  canSave: boolean;
  onClickSave: ButtonOnClick;
  saveIsPending: boolean | undefined;
};

export const EditStrategyTopbar: FC<Props> = ({
  canSave,
  onClickSave,
  saveIsPending,
}) => (
  <Columns className={classNames("is-marginless")}>
    <Column isNarrow className={classNames("p-0")}>
      <Level
        isMobile
        className={classNames("is-marginless", "p-2")}
        right={
          <Buttons>
            <Button
              color={canSave ? "primary" : undefined}
              isLoading={saveIsPending}
              onClick={onClickSave}
            >
              <FormattedMessage id="buttonLabel.save" />
            </Button>
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
