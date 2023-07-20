import { Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettingsButton } from "./GoSettingsButton.js";

export const PleasePurchaseModal: FC = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <p>You cannot run a strategy without a subscription.</p>

        <p>
          <FormattedMessage
            id="PleasePurchaseModal.goToSettings"
            values={{ em: (chunks) => <em>{chunks}</em> }}
          />
        </p>
      </Message>

      <GoSettingsButton settingsPage="billing" />
    </Modal>
  );
};
