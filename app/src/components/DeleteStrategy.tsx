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
import { FC, useCallback, useEffect, useState } from "react";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel, fieldLabel } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";
import { StrategyInfo } from "../routing/types.js";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategy: FC<Props> = ({
  strategyKey,
  name,
  whenCreated,
}) => {
  const [DELETE, { isPending, data }] = useApi.DeleteStrategy();

  const isLoading = isPending || Boolean(data);

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (isPending) return;
    DELETE(strategyKey);
  }, [DELETE, isPending, strategyKey]);

  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  useEffect(() => {
    if (!data) return;
    window.location.pathname = pathname.homePage();
  }, [data]);

  return (
    <>
      <Button color="warning" onClick={toggleModal}>
        {buttonLabel.deleteStrategy}
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Message header="Strategy deletion" color="warning">
          <p>Are you sure you want to delete this strategy?</p>
        </Message>

        <Box>
          <Columns>
            <Column>
              <OutputField label={fieldLabel.strategyName} value={name} />
            </Column>
          </Columns>

          <Columns>
            <Column>
              <OutputField
                label={fieldLabel.strategyId}
                value={strategyKey.strategyId}
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
