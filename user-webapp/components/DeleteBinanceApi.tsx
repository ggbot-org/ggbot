import {
  Button,
  Buttons,
  Message,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
} from "@ggbot2/design";
import { FC, useCallback, useEffect, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel } from "_i18n";

type Props = {
  onDelete: () => void;
};

export const DeleteBinanceApi: FC<Props> = ({ onDelete }) => {
  const [DELETE, { data, isPending }] = useApiAction.DeleteBinanceApiConfig();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (isPending) return;
    DELETE({});
  }, [DELETE, isPending]);

  useEffect(() => {
    if (!data) return;
    setModalIsActive(false);
    onDelete();
  }, [data, onDelete]);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        {buttonLabel.deleteApi}
      </Button>

      <Modal isActive={modalIsActive}>
        <ModalBackground onClick={toggleModal} />

        <ModalContent>
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
              isLoading={isPending}
              onClick={onClickConfirmation}
            >
              {buttonLabel.yesDelete}
            </Button>

            <Button onClick={toggleModal}>{buttonLabel.no}</Button>
          </Buttons>

          <ModalClose onClick={toggleModal} />
        </ModalContent>
      </Modal>
    </>
  );
};
