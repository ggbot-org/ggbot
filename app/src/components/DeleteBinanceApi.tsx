import {
  Button,
  Buttons,
  Content,
  MainColor,
  Message,
  Modal,
} from "@ggbot2/design";
import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useApi } from "../hooks/useApi.js";

type Props = {
  onDelete: () => void;
};

export const DeleteBinanceApi: FC<Props> = ({ onDelete }) => {
  const color: MainColor = "warning";

  const { formatMessage } = useIntl();

  const DELETE = useApi.DeleteBinanceApiConfig();
  const canCloseModal = DELETE.isDone;
  const isLoading = DELETE.isPending;

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (DELETE.canRun) DELETE.request();
  }, [DELETE]);

  useEffect(() => {
    if (canCloseModal) {
      setModalIsActive(false);
      onDelete();
    }
  }, [canCloseModal, onDelete]);

  return (
    <>
      <Button color={color} onClick={toggleModal}>
        <FormattedMessage id="DeleteBinanceApi.button" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message
          header={formatMessage({ id: "DeleteBinanceApi.title" })}
          color={color}
        >
          <Content>
            <p>
              <FormattedMessage id="DeleteBinanceApi.question" />
            </p>

            <p>All your ggbot2 strategies will not able to be run.</p>

            <p>This action will not delete your API key on Binance website.</p>
          </Content>

          <Buttons>
            <Button
              color={color}
              isLoading={isLoading}
              onClick={onClickConfirmation}
            >
              <FormattedMessage id="DeleteBinanceApi.confirmation" />
            </Button>

            <Button onClick={toggleModal}>
              <FormattedMessage id="DeleteBinanceApi.dismiss" />
            </Button>
          </Buttons>
        </Message>
      </Modal>
    </>
  );
};
