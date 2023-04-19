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
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useApi } from "_hooks/useApi";
import { buttonLabel, fieldLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import { StrategyInfo } from "_routing/types";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategy: FC<Props> = ({
  strategyKey,
  name,
  whenCreated,
}) => {
  const router = useRouter();

  const [DELETE, { isPending, data }] = useApi.DeleteStrategy();

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
    router.push(pathname.homePage());
  }, [data, router]);

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
            isLoading={isPending || !!data}
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
