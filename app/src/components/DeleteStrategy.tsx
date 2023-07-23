import {
  Box,
  Button,
  Buttons,
  Column,
  Columns,
  Message,
  Modal,
  OutputField,
  useFormattedDate,
} from "@ggbot2/design";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, fieldLabel, messageHeader } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";

export const DeleteStrategy: FC = () => {
  const { strategyWhenCreated, strategyName, strategyKey } =
    useContext(StrategyContext);

  const DELETE = useApi.DeleteStrategy()
  const isLoading = DELETE.isPending||DELETE.isDone
  const redirectToHomepage = DELETE.isDone

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (strategyKey) DELETE.request(strategyKey);
  }, [DELETE, strategyKey]);

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "time");

  useEffect(() => {
    if (redirectToHomepage) window.location.href = href.homePage();
  }, [redirectToHomepage]);

  return (
    <>
      <Button color="warning" onClick={toggleModal}>
      <FormattedMessage id="DeleteStrategy.buttonLabel"/>
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header={messageHeader.strategyDeletion} color="warning">
          <p>Are you sure you want to delete this strategy?</p>
        </Message>

        <Box>
          <Columns>
            <Column>
              <OutputField
                label={fieldLabel.strategyName}
                value={strategyName}
              />
            </Column>
          </Columns>

          <Columns>
            <Column>
              <OutputField
                label={fieldLabel.strategyId}
                value={strategyKey?.strategyId}
              />
            </Column>

            <Column>
              <OutputField
                label={fieldLabel.whenCreated}
                value={formattedWhenCreated}
              />
            </Column>
          </Columns>
        </Box>

        <Buttons>
          <Button
            color="warning"
            isLoading={isLoading}
            onClick={onClickConfirmation}
          >
            {buttonLabel.yesDelete}
          </Button>

          <Button onClick={toggleModal}>{buttonLabel.no}</Button>
        </Buttons>
      </Modal>
    </>
  );
};
