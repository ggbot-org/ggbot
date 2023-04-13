import {
  Message,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
} from "@ggbot2/design";
import { FC, useState } from "react";
import { GoSettingsButton } from "./GoSettingsButton";

export const PleasePurchaseModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  const toggleModal = () => {
    setIsActive((active) => !active);
  };

  return (
    <Modal isActive={isActive}>
      <ModalBackground />

      <ModalContent>
        <Message color="info">
          <p>You cannot run a strategy without a subscription.</p>

          <p>
            Please go to <em>Settings</em> and <b>purchase</b> a subscription.
          </p>
        </Message>

        <GoSettingsButton section="billing" />

        <ModalClose onClick={toggleModal} />
      </ModalContent>
    </Modal>
  );
};
