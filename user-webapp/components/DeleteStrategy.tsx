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
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategy: FC<Props> = ({ strategyKey, name, whenCreated }) => {
  const router = useRouter();

  const [deleteStrategy, { isPending: deleteIsPending, data }] = useApiAction.DeleteStrategy();

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
    router.push(route.homePage());
  }, [data, router]);

  useStopScroll(modalIsActive);

  return (
    <>
      <Button color="danger" onClick={toggleModal}>
        Delete strategy
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
                <InputField readOnly label="Strategy name" defaultValue={name} />
              </Column>
            </Columns>

            <Columns>
              <Column>
                <InputField readOnly label="Strategy ID" defaultValue={strategyKey.strategyId} />
              </Column>

              <Column>
                <InputField readOnly label="When created" defaultValue={formattedWhenCreated} />
              </Column>
            </Columns>
          </Box>

          <Buttons>
            <Button color="danger" isLoading={deleteIsPending} onClick={onClickConfirmation}>
              Yes, delete it!
            </Button>

            <Button onClick={toggleModal}>No</Button>
          </Buttons>

          <ModalClose onClick={toggleModal} />
        </ModalContent>
      </Modal>
    </>
  );
};
