import {
  Button,
  Buttons,
  Column,
  Columns,
  Content,
  MainColor,
  Message,
  Modal,
  OutputField,
  useFormattedDate,
} from "@ggbot2/design";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { href } from "../routing/hrefs.js";

export const DeleteStrategy: FC = () => {
  const color: MainColor = "warning";

  const { formatMessage } = useIntl();

  const { strategyWhenCreated, strategyName, strategyId, strategyKey } =
    useContext(StrategyContext);

  const DELETE = useApi.DeleteStrategy();
  const isLoading = DELETE.isPending || DELETE.isDone;
  const redirectToHomepage = DELETE.isDone;

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (strategyKey) DELETE.request(strategyKey);
  }, [DELETE, strategyKey]);

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "time");

  useEffect(() => {
    if (redirectToHomepage) window.location.href = href.homePage();
  }, [redirectToHomepage]);

  return (
    <>
      <Button color={color} onClick={toggleModal}>
        <FormattedMessage id="DeleteStrategy.buttonLabel.cta" />
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
                <OutputField
                  label={formatMessage({ id: "fieldLabel.strategyName" })}
                  value={strategyName}
                />
              </Column>
            </Columns>

            <Columns>
              <Column>
                <OutputField
                  label={formatMessage({ id: "fieldLabel.strategyId" })}
                  value={strategyId}
                />
              </Column>

              <Column>
                <OutputField
                  label={formatMessage({ id: "fieldLabel.whenCreated" })}
                  value={formattedWhenCreated}
                />
              </Column>
            </Columns>
          </Content>

          <Buttons>
            <Button
              color={color}
              isLoading={isLoading}
              onClick={onClickConfirmation}
            >
              <FormattedMessage id="DeleteStrategy.buttonLabel.confirmation" />
            </Button>

            <Button onClick={toggleModal}>
              <FormattedMessage id="buttonLabel.no" />
            </Button>
          </Buttons>
        </Message>
      </Modal>
    </>
  );
};
