import { Buttons, Content, Message, Modal } from "@ggbot2/design";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoSettings } from "../components/GoSettings.js";

export const PleaseConfigureBinance: FC = () => {
  const [isActive, setIsActive] = useState(true);

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
        </Content>

        <Buttons>
          <GoSettings settingsPage="binance" />
        </Buttons>
      </Message>
    </Modal>
  );
};
