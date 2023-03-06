import { Button, Buttons, ButtonOnClick, Message, Modal, ModalContent } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { useApiAction } from "_hooks";

export const DeleteAccount: FC = () => {
  const [deleteAccount, { isPending: deleteAccountIsPending }] = useApiAction.DeleteAccount();

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
      if (deleteAccountIsPending) return;
      deleteAccount({});
    },
    [deleteAccount, deleteAccountIsPending]
  );

  return (
    <>
      <Button color="danger" onClick={openModal}>
        Delete account
      </Button>

      <Modal isActive={modalIsActive}>
        <ModalContent>
          <Message header="Account deletion" color="warning">
            <p>Are you sure you want to delete your account?</p>
          </Message>

          <Buttons>
            <Button color="danger" isLoading={deleteAccountIsPending} onClick={onClickConfirmation}>
              Yes, delete it!
            </Button>

            <Button onClick={closeModal}>No</Button>
          </Buttons>
        </ModalContent>
      </Modal>
    </>
  );
};
