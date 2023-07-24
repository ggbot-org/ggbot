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
import { FormattedMessage, useIntl } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { href } from "../routing/hrefs.js";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const CreateStrategy: FC = () => {
  const { formatMessage } = useIntl();

  const CREATE = useApi.CreateStrategy();

  const strategy = CREATE.data;
  const readOnly = CREATE.isPending;
  const isLoading = CREATE.isPending || CREATE.isDone;

  const [modalIsActive, setModalIsActive] = useState(false);
  const [help, setHelp] = useState("");

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (!CREATE.canRun) return;
        const { name } = formValues(event, fields);
        throwIfInvalidName(name);
        if (isName(name)) CREATE.request({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) {
          setHelp(formatMessage({ id: "errorMessage.invalidStrategyName" }));
          return;
        }
        console.error(error);
      }
    },
    [CREATE, formatMessage]
  );

  useEffect(() => {
    if (isStrategy(strategy)) {
      const { id, kind } = strategy;
      window.location.href = href.editFlowPage({
        strategyId: id,
        strategyKind: kind,
      });
    }
  }, [strategy]);

  return (
    <>
      <Columns>
        <Column>
          <Button onClick={toggleModal}>
            <FormattedMessage id="CreateStrategy.buttonLabel" />
          </Button>
        </Column>
      </Columns>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Form box onSubmit={onSubmit}>
          <Title>
            <FormattedMessage id="CreateStrategy.title" />
          </Title>

          <InputField
            required
            label={formatMessage({ id: "fieldLabel.strategyName" })}
            name={fieldName.name}
            readOnly={readOnly}
            help={help}
          />

          <Field>
            <Control>
              <Button color="primary" isLoading={isLoading}>
                <FormattedMessage id="buttonLabel.create" />
              </Button>
            </Control>
          </Field>
        </Form>
      </Modal>
    </>
  );
};
