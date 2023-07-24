import { Button, Buttons, Message, Modal } from "@ggbot2/design";
import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel } from "../i18n/index.js";

type Props = {
  onDelete: () => void;
};

export const DeleteBinanceApi: FC<Props> = ({ onDelete }) => {
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
      <Button color="danger" onClick={toggleModal}>
        <FormattedMessage id="DeleteBinanceApi.buttonLabel" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header="Binance API deletion" color="warning">
          <p>
            Are you sure you want to delete your Binance API configuration on
            ggbot2?
          </p>

          <p>All your ggbot2 strategies will not able to run.</p>

          <p>This action will not delete your API key on Binance website.</p>
        </Message>

        <Buttons>
          <Button
            color="danger"
            isLoading={isLoading}
            onClick={onClickConfirmation}
          >
            {buttonLabel.yesDelete}
          </Button>

          <Button onClick={toggleModal}>{buttonLabel.no}</Button>
        </Buttons>
      </Modal>
    </>
  );
};
