import {
  Message,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
} from "@ggbot2/design";
import { FC, useCallback, useState } from "react";
import { GoSettingsButton } from "./GoSettingsButton";

export const PleaseConfigureBinanceModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  const toggleModal = useCallback(() => {
    setIsActive((active) => !active);
  }, []);

  return (
    <Modal isActive={isActive}>
      <ModalBackground />

      <ModalContent>
        <Message color="info">
          <p>You cannot run strategies on Binance yet.</p>

          <p>
            Please go to <em>Settings</em> and configure your <b>Binance</b>{" "}
            API.
          </p>
        </Message>

        <GoSettingsButton section="binance" />

        <ModalClose onClick={toggleModal} />
      </ModalContent>
    </Modal>
  );
};
