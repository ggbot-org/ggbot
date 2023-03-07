import {
  Button,
  Buttons,
  Message,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
  useStopScroll,
} from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { useApiAction } from "_hooks";

export const DeleteBinanceApi: FC = () => {
  const [deleteBinanceApi, { isPending: deleteIsPending }] = useApiAction.DeleteBinanceApiConfig();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (deleteIsPending) return;
    deleteBinanceApi({});
  }, [deleteBinanceApi, deleteIsPending]);

  useStopScroll(modalIsActive);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        Delete API
      </Button>

      <Modal isActive={modalIsActive}>
        <ModalBackground onClick={toggleModal} />

        <ModalContent>
          <Message header="Binance API deletion" color="warning">
            <p>Are you sure you want to delete your Binance API configuration on ggbot2?</p>

            <p>All your ggbot2 strategies will not able to run.</p>

            <p>This action will not delete your API key on Binance website.</p>
          </Message>

          <Buttons>
            <Button color="danger" isLoading={deleteIsPending} onClick={onClickConfirmation}>
              Yes, delete it!
            </Button>

            <Button onClick={toggleModal}>No</Button>
          </Buttons>

          <ModalClose onClick={toggleModal} />
        </ModalContent>
      </Modal>
    </>
  );
};
