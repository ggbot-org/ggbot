import {
  Button,
  Buttons,
  Content,
  MainColor,
  Message,
  Modal,
} from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useApi } from "../hooks/useApi.js";

export const DeleteAccount: FC = () => {
  const color: MainColor = "danger";

  const { formatMessage } = useIntl();

  const DELETE = useApi.DeleteAccount();
  const isLoading = DELETE.isPending;

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (DELETE.canRun) DELETE.request();
  }, [DELETE]);

  return (
    <>
      <Button color={color} onClick={toggleModal}>
        <FormattedMessage id="DeleteAccount.button" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message
          header={formatMessage({ id: "DeleteAccount.title" })}
          color={color}
        >
          <Content>
            <p>
              <FormattedMessage id="DeleteAccount.question" />
            </p>
          </Content>

          {/*
TODO further confirmation checkbox: I understand the consequences.
*/}

          <Buttons>
            <Button
              color={color}
              isLoading={isLoading}
              onClick={onClickConfirmation}
            >
              <FormattedMessage id="DeleteAccount.confirmation" />
            </Button>

            <Button onClick={toggleModal}>
              <FormattedMessage id="DeleteAccount.dismiss" />
            </Button>
          </Buttons>
        </Message>
      </Modal>
    </>
  );
};
