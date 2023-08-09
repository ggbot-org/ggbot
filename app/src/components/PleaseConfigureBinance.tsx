import {
  Buttons,
  Checkbox,
  CheckboxOnChange,
  Content,
  Message,
  Modal,
} from "@ggbot2/design";
import { sessionWebStorage } from "@ggbot2/web-storage";
import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";

export const PleaseConfigureBinance: FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [doNotShow, setDoNotShow] = useState(false);

  // TODO const { hasBinanceConfiguration } = useContext(BinanceContext);

  const onChangeDoNotShow = useCallback<CheckboxOnChange>((event) => {
    const checked = event.target.checked;
    setDoNotShow(checked);
    sessionWebStorage.doNotShowPleaseConfigureBinance = checked;
  }, []);

  useEffect(() => {
    if (sessionWebStorage.doNotShowPleaseConfigureBinance) return;
    // Show PleasePurchase first, then PleaseConfigureBinance.
    if (!sessionWebStorage.doNotShowPleasePurchase) return;
    setIsActive(true);
  }, []);

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
