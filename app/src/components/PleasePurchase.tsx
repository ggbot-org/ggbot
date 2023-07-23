import { Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";

export const PleasePurchase: FC = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <p>
        <FormattedMessage id="PleasePurchase.message"/>
        </p>

        <p>
          <FormattedMessage
            id="PleasePurchase.goToSettings"
            values={{ em: (chunks) => <em>{chunks}</em> }}
          />
        </p>
      </Message>

      <GoSettings settingsPage="billing" />
    </Modal>
  );
};
