import { Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettingsButton } from "./GoSettingsButton.js";

export const PleaseConfigureBinanceModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <p>You cannot run strategies on Binance yet.</p>

        <p>
          <FormattedMessage
            id="PleaseConfigureBinanceModal.goToSettings"
            values={{ em: (chunks) => <em>{chunks}</em> }}
          />
        </p>
      </Message>

      <GoSettingsButton settingsPage="binance" />
    </Modal>
  );
};
