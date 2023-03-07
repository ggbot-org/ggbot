import { Message, Modal, ModalBackground, ModalClose, ModalContent, useStopScroll } from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { ButtonGoSettings } from "./ButtonGoSettings";

export const PleasePurchaseModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  useStopScroll(isActive);

  const toggleModal = useCallback(() => {
    setIsActive((active) => !active);
  }, []);

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

        <ButtonGoSettings section="billing" />

        <ModalClose onClick={toggleModal} />
      </ModalContent>
    </Modal>
  );
};
