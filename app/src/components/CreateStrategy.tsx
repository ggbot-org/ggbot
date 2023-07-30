import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Title,
} from "@ggbot2/design";
import { isName } from "@ggbot2/models";
import { FC, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { StrategiesQuotaExceededError } from "../components/StrategiesQuotaExceededError.js";
import { StrategyName } from "../components/StrategyName.js";
import { useApi } from "../hooks/useApi.js";
import { useRedirectToNewStrategyPage } from "../hooks/useRedirectToNewStrategyPage.js";

const fields = ["name"];
type Field = (typeof fields)[number];
const fieldName = {
  name: "name",
} as const satisfies Record<string, Field>;

export const CreateStrategy: FC = () => {
  const CREATE = useApi.CreateStrategy();

  const newStrategy = CREATE.data;
  const readOnly = CREATE.isPending;
  const isLoading = CREATE.isPending || CREATE.isDone;
  const error = CREATE.error;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!CREATE.canRun) return;
      const { name } = formValues(event, fields);
      if (isName(name)) CREATE.request({ kind: "binance", name });
    },
    [CREATE]
  );

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <>
      <Form box onSubmit={onSubmit}>
        <Title>
          <FormattedMessage id="CreateStrategy.title" />
        </Title>

        <StrategyName required name={fieldName.name} readOnly={readOnly} />

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
