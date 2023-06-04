import { Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";

import { GoSettingsButton } from "./GoSettingsButton.js";

export const PleaseConfigureBinanceModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <p>You cannot run strategies on Binance yet.</p>

        <p>
          Please go to <em>Settings</em> and configure your <b>Binance</b> API.
        </p>
      </Message>

      <GoSettingsButton section="binance" />
    </Modal>
  );
};
