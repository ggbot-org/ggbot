import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Title,
} from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { FC, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StrategiesQuotaExceededError } from "../components/StrategiesQuotaExceededError.js";
import { StrategyName } from "../components/StrategyName.js";
import { useApi } from "../hooks/useApi.js";
import { useRedirectToNewStrategyPage } from "../hooks/useRedirectToNewStrategyPage.js";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const CreateStrategy: FC = () => {
  const { formatMessage } = useIntl();

  const CREATE = useApi.CreateStrategy();

  const newStrategy = CREATE.data;
  const readOnly = CREATE.isPending;
  const isLoading = CREATE.isPending || CREATE.isDone;
  const error = CREATE.error;

  const [help, setHelp] = useState("");

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

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <>
      <Form box onSubmit={onSubmit}>
        <Title>
          <FormattedMessage id="CreateStrategy.title" />
        </Title>

        <StrategyName
          required
          name={fieldName.name}
          readOnly={readOnly}
          help={help}
        />

        <Field>
          <Control>
            <Button color="primary" isLoading={isLoading}>
              <FormattedMessage id="CreateStrategy.button" />
            </Button>
          </Control>
        </Field>
      </Form>

      <StrategiesQuotaExceededError error={error} />
    </>
  );
};
