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
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";
import { BinanceApiConfigContext } from "../contexts/BinanceApiConfig.js";

export const PleaseConfigureBinance: FC = () => {
  const { hasApiKey } = useContext(BinanceApiConfigContext);

  const [isActive, setIsActive] = useState(true);
  const [doNotShow, setDoNotShow] = useState(false);

  const onChangeDoNotShow = useCallback<CheckboxOnChange>((event) => {
    const checked = event.target.checked;
    setDoNotShow(checked);
    sessionWebStorage.doNotShowPleaseConfigureBinance.set(checked);
  }, []);

  useEffect(() => {
    if (sessionWebStorage.doNotShowPleaseConfigureBinance) return;
    // Show PleasePurchase first, then show PleaseConfigureBinance after a while.
    if (!sessionWebStorage.doNotShowPleasePurchase) return;
    const timeoutId = window.setTimeout(() => {
      setIsActive(true);
    }, 17000);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (hasApiKey === undefined || hasApiKey) return null;

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Message color="info">
        <Content>
          <p>
            <FormattedMessage id="PleaseConfigureBinance.message" />
          </p>

          <p>
            <FormattedMessage
              id="PleaseConfigureBinance.goToSettings"
              values={{
                b: (chunks) => <b>{chunks}</b>,
                em: (chunks) => <em>{chunks}</em>,
              }}
            />
          </p>

          <Checkbox checked={doNotShow} onChange={onChangeDoNotShow}>
            <FormattedMessage id="PleasePurchase.doNotShow" />
          </Checkbox>
        </Content>

        <Buttons>
          <GoSettings settingsPage="binance" />
        </Buttons>
      </Message>
    </Modal>
  );
};
