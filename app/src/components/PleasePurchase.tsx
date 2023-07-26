import { Buttons, Content, Message, Modal } from "@ggbot2/design";
import { FC, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";
import { SubscriptionContext } from "../contexts/Subscription.js";

export const PleasePurchase: FC = () => {
  const { hasActiveSubscription } = useContext(SubscriptionContext);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (hasActiveSubscription === false) setIsActive(true);
  }, [hasActiveSubscription]);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <Content>
          <p>
            <FormattedMessage id="PleasePurchase.message" />
          </p>

          <p>
            <FormattedMessage
              id="PleasePurchase.goToSettings"
              values={{ em: (chunks) => <em>{chunks}</em> }}
            />
          </p>
        </Content>

        <Buttons>
          <GoSettings settingsPage="billing" />
        </Buttons>
      </Message>
    </Modal>
  );
};
