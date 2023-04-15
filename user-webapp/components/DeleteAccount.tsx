import { Button, Buttons, Message, Modal } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel } from "_i18n";

export const DeleteAccount: FC = () => {
  const [deleteAccount, { isPending: deleteIsPending }] =
    useApiAction.DeleteAccount();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (deleteIsPending) return;
    deleteAccount({});
  }, [deleteAccount, deleteIsPending]);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        {buttonLabel.deleteAccount}
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header="Account deletion" color="warning">
          <p>Are you sure you want to delete your account?</p>
        </Message>

        <Buttons>
          <Button
            color="danger"
            isLoading={deleteIsPending}
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
