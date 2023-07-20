import { Button, Buttons, Message, Modal } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel } from "../i18n/index.js";

export const DeleteAccount: FC = () => {
  const { request: DELETE, isPending } = useApi.DeleteAccount();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    DELETE({});
  }, [DELETE]);

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
