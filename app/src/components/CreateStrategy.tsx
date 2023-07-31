import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Message,
  Section,
  Title,
} from "@ggbot2/design";
import { isName } from "@ggbot2/models";
import { UseActionError } from "@ggbot2/use-action";
import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { StrategiesErrorExceededQuota } from "../components/StrategiesErrorExceededQuota.js";
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

  const [error, setError] = useState<UseActionError>();

  const newStrategy = CREATE.data;
  const readOnly = CREATE.isPending;
  const isLoading = CREATE.isPending || CREATE.isDone;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!CREATE.canRun) return;
      const { name } = formValues(event, fields);
      if (isName(name)) CREATE.request({ kind: "binance", name });
    },
    [CREATE]
  );

  useEffect(() => {
    if (CREATE.error) {
      setError(CREATE.error);
      CREATE.reset();
    }
  }, [CREATE]);

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <Form box onSubmit={onSubmit}>
      <Section>
        <Title>
          <FormattedMessage id="CreateStrategy.title" />
        </Title>

        {error ? null : (
          <Message color="info">
            <FormattedMessage
              id="CreateStrategy.chooseName"
              values={{ em: (chunks) => <em>{chunks}</em> }}
            />
          </Message>
        )}

        <StrategiesErrorExceededQuota error={error} />

        <StrategyName required name={fieldName.name} readOnly={readOnly} />

        <Field>
          <Control>
            <Button color={error ? "warning" : undefined} isLoading={isLoading}>
              <FormattedMessage id="CreateStrategy.button" />
            </Button>
          </Control>
        </Field>
      </Section>
    </Form>
  );
};
