import {
  Buttons,
  Checkbox,
  CheckboxOnChange,
  Content,
  Message,
  Modal,
} from "@ggbot2/design";
import { sessionWebStorage } from "@ggbot2/web-storage";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";
import { SubscriptionContext } from "../contexts/Subscription.js";
import { classNames } from "../styles/classNames.js";

export const PleasePurchase: FC = () => {
  const { formatMessage } = useIntl();

  const { hasActiveSubscription } = useContext(SubscriptionContext);

  const [
    doNotShowPleasePurchaseIsChecked,
    setDoNotShowPleasePurchaseIsChecked,
  ] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onChangeDoNotShowPleasePurchase = useCallback<CheckboxOnChange>(
    (event) => {
      const checked = event.target.checked;
      setDoNotShowPleasePurchaseIsChecked(checked);
      sessionWebStorage.doNotShowPleasePurchase = checked;
    },
    []
  );

  useEffect(() => {
    if (sessionWebStorage.doNotShowPleasePurchase) return;
    if (hasActiveSubscription === false) setIsActive(true);
  }, [hasActiveSubscription]);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message
        color="info"
        header={formatMessage({ id: "PleasePurchase.title" })}
      >
        <Content>
          <p>
            <FormattedMessage id="PleasePurchase.message" />
          </p>

          <p>
            <FormattedMessage
              id="PleasePurchase.goToSettings"
              values={{
                b: (chunks) => <b>{chunks}</b>,
                em: (chunks) => <em>{chunks}</em>,
              }}
            />
          </p>

          <Checkbox
            checked={doNotShowPleasePurchaseIsChecked}
            onChange={onChangeDoNotShowPleasePurchase}
          >
            <span className={classNames("ml-2")}>
              <FormattedMessage id="PleasePurchase.doNotShow" />
            </span>
          </Checkbox>
        </Content>

        <Buttons>
          <GoSettings settingsPage="billing" />
        </Buttons>
      </Message>
    </Modal>
  );
};
