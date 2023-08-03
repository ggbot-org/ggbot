import {
  Button,
  Buttons,
  Checkbox,
  CheckboxOnChange,
  Content,
  MainColor,
  Message,
  Modal,
  ModalProps,
} from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { classNames } from "../styles/classNames.js";

export const DeleteAccount: FC = () => {
  const color: MainColor = "danger";

  const { formatMessage } = useIntl();

  const DELETE = useApi.DeleteAccount();
  const isLoading = DELETE.isPending;

  const [hasConsent, setHasConsent] = useState(false);
  const [modalIsActive, setModalIsActive] = useState(false);

  const _setModalIsActive = useCallback<
    Exclude<ModalProps["setIsActive"], undefined>
  >((isActive) => {
    setModalIsActive(isActive);
    setHasConsent(false);
  }, []);

  const onChangeConsent = useCallback<CheckboxOnChange>(
    (event) => {
      setHasConsent(event.target.checked);
    },
    [setHasConsent]
  );

  const openModal = useCallback(() => {
    _setModalIsActive(true);
  }, [_setModalIsActive]);

  const closeModal = useCallback(() => {
    _setModalIsActive(false);
    setHasConsent(false);
  }, [_setModalIsActive]);

  const onClickConfirmation = useCallback(() => {
    if (!hasConsent) return;
    if (DELETE.canRun) DELETE.request();
  }, [DELETE, hasConsent]);

  return (
    <>
      <Button color={color} onClick={openModal}>
        <FormattedMessage id="DeleteAccount.button" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={_setModalIsActive}>
        <Message
          header={formatMessage({ id: "DeleteAccount.title" })}
          color={color}
        >
          <Content>
            <p>
              <FormattedMessage id="DeleteAccount.question" />
            </p>

            <Checkbox
              checked={hasConsent}
              onChange={onChangeConsent}
              color="danger"
            />

            <span className={classNames("ml-2")}>
              <FormattedMessage id="DeleteAccount.consent" />
            </span>
          </Content>

          <Buttons>
            <Button
              color={hasConsent ? color : undefined}
              isLoading={isLoading}
              onClick={onClickConfirmation}
            >
              <FormattedMessage id="DeleteAccount.confirmation" />
            </Button>

            <Button onClick={closeModal}>
              <FormattedMessage id="DeleteAccount.dismiss" />
            </Button>
          </Buttons>
        </Message>
      </Modal>
    </>
  );
};
