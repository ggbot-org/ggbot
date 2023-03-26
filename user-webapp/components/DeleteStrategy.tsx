import {
  Box,
  Button,
  Buttons,
  Column,
  Columns,
  Message,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
  InputField,
  useFormattedDate,
  useStopScroll,
} from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel } from "_i18n";
import { StrategyInfo, pathname } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategy: FC<Props> = ({
  strategyKey,
  name,
  whenCreated,
}) => {
  const router = useRouter();

  const [deleteStrategy, { isPending: deleteIsPending, data }] =
    useApiAction.DeleteStrategy();

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onClickConfirmation = useCallback(() => {
    if (deleteIsPending) return;
    deleteStrategy(strategyKey);
  }, [deleteStrategy, deleteIsPending, strategyKey]);

  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  useEffect(() => {
    if (!data) return;
    router.push(pathname.homePage());
  }, [data, router]);

  useStopScroll(modalIsActive);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        {buttonLabel.deleteStrategy}
      </Button>

      <Modal isActive={modalIsActive}>
        <ModalBackground onClick={toggleModal} />

        <ModalContent>
          <Message header="Strategy deletion" color="warning">
            <p>Are you sure you want to delete this strategy?</p>
          </Message>

          <Box>
            <Columns>
              <Column>
                <InputField
                  readOnly
                  label={fieldLabel.strategyName}
                  defaultValue={name}
                />
              </Column>
            </Columns>

            <Columns>
              <Column>
                <InputField
                  readOnly
                  label={fieldLabel.strategyId}
                  defaultValue={strategyKey.strategyId}
                />
              </Column>

              <Column>
                <InputField
                  readOnly
                  label={fieldLabel.whenCreated}
                  defaultValue={formattedWhenCreated}
                />
              </Column>
            </Columns>
          </Box>

          <Buttons>
            <Button
              color="danger"
              isLoading={deleteIsPending}
              onClick={onClickConfirmation}
            >
              {buttonLabel.yesDelete}
            </Button>

            <Button onClick={toggleModal}>{buttonLabel.no}</Button>
          </Buttons>

          <ModalClose onClick={toggleModal} />
        </ModalContent>
      </Modal>
    </>
  );
};
