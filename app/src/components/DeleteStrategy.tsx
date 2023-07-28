import {
  Button,
  Buttons,
  Column,
  Columns,
  Content,
  MainColor,
  Message,
  Modal,
} from "@ggbot2/design";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StrategyId } from "../components/StrategyId.js";
import { StrategyName } from "../components/StrategyName.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { href } from "../routing/hrefs.js";

export const DeleteStrategy: FC = () => {
  const color: MainColor = "warning";

  const { formatMessage } = useIntl();

  const { strategy } = useContext(StrategyContext);

  const DELETE = useApi.DeleteStrategy();
  const isLoading = DELETE.isPending || DELETE.isDone;
  const redirectToHomepage = DELETE.isDone;

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (strategy)
      DELETE.request({ strategyId: strategy.id, strategyKind: strategy.kind });
  }, [DELETE, strategy]);

  useEffect(() => {
    if (redirectToHomepage) window.location.href = href.homePage();
  }, [redirectToHomepage]);

  return (
    <>
      <Button color={color} onClick={toggleModal}>
        <FormattedMessage id="DeleteStrategy.button" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message
          header={formatMessage({ id: "DeleteStrategy.title" })}
          color={color}
        >
          <Content>
            <p>
              <FormattedMessage id="DeleteStrategy.message" />
            </p>

            <Columns>
              <Column>
                <StrategyName readOnly value={strategy.name} />
              </Column>
            </Columns>

            <Columns>
              <Column>
                <StrategyId value={strategy.id} />
              </Column>

              <Column>
                <WhenCreated value={strategy.whenCreated} />
              </Column>
            </Columns>
          </Content>

          <Buttons>
            <Button
              color={color}
              isLoading={isLoading}
              onClick={onClickConfirmation}
            >
              <FormattedMessage id="DeleteStrategy.confirmation" />
            </Button>

            <Button onClick={toggleModal}>
              <FormattedMessage id="DeleteStrategy.dismiss" />
            </Button>
          </Buttons>
        </Message>
      </Modal>
    </>
  );
};
