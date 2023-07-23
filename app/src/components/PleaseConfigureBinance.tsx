import { Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";

export const PleaseConfigureBinance: FC = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <p>You cannot run strategies on Binance yet.</p>

        <p>
          <FormattedMessage
            id="PleaseConfigureBinance.goToSettings"
            values={{ em: (chunks) => <em>{chunks}</em> }}
          />
        </p>
      </Message>

      <GoSettings settingsPage="binance" />
    </Modal>
  );
};
