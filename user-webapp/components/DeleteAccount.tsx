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
import { buttonLabel } from "_i18n";

export const DeleteAccount: FC = () => {
  const [deleteAccount, { isPending: deleteIsPending }] = useApiAction.DeleteAccount();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (deleteIsPending) return;
    deleteAccount({});
  }, [deleteAccount, deleteIsPending]);

  useStopScroll(modalIsActive);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        {buttonLabel.deleteAccount}
      </Button>

      <Modal isActive={modalIsActive}>
        <ModalBackground onClick={toggleModal} />

        <ModalContent>
          <Message header="Account deletion" color="warning">
            <p>Are you sure you want to delete your account?</p>
          </Message>

          <Buttons>
            <Button color="danger" isLoading={deleteIsPending} onClick={onClickConfirmation}>
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