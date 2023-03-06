import { Button, Buttons, ButtonOnClick, Message, Modal, ModalContent } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { useApiAction } from "_hooks";

export const DeleteBinanceApi: FC = () => {
  const [deleteBinanceApi, { isPending: deleteIsPending }] = useApiAction.DeleteBinanceApiConfig();

  const [modalIsActive, setModalIsActive] = useState(false);

  const closeModal = useCallback<ButtonOnClick>((event) => {
    event.stopPropagation();
    setModalIsActive(false);
  }, []);

  const openModal = useCallback<ButtonOnClick>((event) => {
    event.stopPropagation();
    setModalIsActive(true);
  }, []);

  const onClickConfirmation = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (deleteIsPending) return;
      deleteBinanceApi({});
    },
    [deleteBinanceApi, deleteIsPending]
  );

  return (
    <>
      <Button color="danger" onClick={openModal}>
        Delete API
      </Button>

      <Modal isActive={modalIsActive}>
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

            <Button onClick={closeModal}>No</Button>
          </Buttons>
        </ModalContent>
      </Modal>
    </>
  );
};
