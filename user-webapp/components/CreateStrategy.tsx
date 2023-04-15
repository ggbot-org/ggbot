import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Modal,
  Title,
  formValues,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isName,
  isStrategy,
  throwIfInvalidName,
} from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel, errorMessage } from "_i18n";
import { pathname } from "_routing";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, typeof fields[number]>;

export const CreateStrategy: FC = () => {
  const router = useRouter();

  const [CREATE, { data, isPending }] = useApiAction.CreateStrategy();

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
      router.push(
        pathname.editFlowPage({ strategyId: id, strategyKind: kind })
      );
    }
  }, [data, router]);

  return (
    <>
      <Button onClick={toggleModal}>{buttonLabel.createStrategy}</Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Form box onSubmit={onSubmit}>
          <Title>Create strategy</Title>

          <InputField
            label={fieldLabel.strategyName}
            name={fieldName.name}
            required
            readOnly={isPending}
            help={help}
          />

          <Field>
            <Control>
              <Button color="primary" isLoading={isPending || !!data}>
                {buttonLabel.create}
              </Button>
            </Control>
          </Field>
        </Form>
      </Modal>
    </>
  );
};
