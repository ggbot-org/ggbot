import { Button, Buttons, Message, Modal } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel } from "../i18n/index.js";

export const DeleteAccount: FC = () => {
const DELETE = useApi.DeleteAccount()
const isLoading = DELETE.isPending

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
  if (DELETE.canRun) DELETE.request()
  }, [DELETE]);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
      <FormattedMessage id="DeleteAccount.buttonLabel"/>
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header="Account deletion" color="danger">
          <p>Are you sure you want to delete your account?</p>
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
