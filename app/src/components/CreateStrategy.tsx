import { useApi } from "_hooks/useApi";
import { buttonLabel, errorMessage, fieldLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import {
  Button,
  Column,
  Columns,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputField,
  Modal,
  Title,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isName,
  isStrategy,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const CreateStrategy: FC = () => {
  const [CREATE, { data, isPending }] = useApi.CreateStrategy();

  const isLoading = isPending || Boolean(data);

  const [modalIsActive, setModalIsActive] = useState(false);
  const [help, setHelp] = useState("");

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      try {
        const { name } = formValues(event, fields);
        throwIfInvalidName(name);
        if (isName(name)) CREATE({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidStrategyName);
      }
    },
    [CREATE, isPending]
  );

  useEffect(() => {
    if (isStrategy(data)) {
      const { id, kind } = data;
      window.location.pathname = pathname.editFlowPage({
        strategyId: id,
        strategyKind: kind,
      });
    }
  }, [data]);

  return (
    <>
      <Columns>
        <Column>
          <Button onClick={toggleModal}>{buttonLabel.createStrategy}</Button>
        </Column>
      </Columns>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Form box onSubmit={onSubmit}>
          <Title>Create strategy</Title>

          <InputField
            required
            label={fieldLabel.strategyName}
            name={fieldName.name}
            readOnly={isPending}
            help={help}
          />

          <Field>
            <Control>
              <Button color="primary" isLoading={isLoading}>
                {buttonLabel.create}
              </Button>
            </Control>
          </Field>
        </Form>
      </Modal>
    </>
  );
};
