import { Button, Buttons, Message, Modal } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { useApi } from "_hooks/useApi";
import { buttonLabel } from "_i18n";

export const DeleteAccount: FC = () => {
  const [DELETE, { isPending }] = useApi.DeleteAccount();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (isPending) return;
    DELETE({});
  }, [DELETE, isPending]);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        {buttonLabel.deleteAccount}
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header="Account deletion" color="danger">
          <p>Are you sure you want to delete your account?</p>
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
      </Modal>
    </>
  );
};
