import {
  Button,
  Container,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputOnChange,
  Message,
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
  const [canCreate, setCanCreate] = useState(false);

  const CREATE = useApi.CreateStrategy();

  const [error, setError] = useState<UseActionError>();

  const newStrategy = CREATE.data;
  const readOnly = CREATE.isPending;
  const isLoading = CREATE.isPending || CREATE.isDone;

  const onChangeName = useCallback<InputOnChange>((event) => {
    setCanCreate(isName(event.target.value));
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!canCreate) return;
      if (!CREATE.canRun) return;
      const { name } = formValues(event, fields);
      if (isName(name)) CREATE.request({ kind: "binance", name });
    },
    [CREATE, canCreate]
  );

  useEffect(() => {
    if (CREATE.error) {
      setError(CREATE.error);
      CREATE.reset();
    }
  }, [CREATE]);

  const color = canCreate ? (error ? "warning" : "primary") : undefined;

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <Container maxWidth="desktop">
      <Form box onSubmit={onSubmit}>
        {error ? null : (
          <Message>
            <FormattedMessage
              id="CreateStrategy.chooseName"
              values={{ em: (chunks) => <em>{chunks}</em> }}
            />
          </Message>
        )}

        <StrategiesErrorExceededQuota error={error} />

        <StrategyName
          required
          name={fieldName.name}
          readOnly={readOnly}
          onChange={onChangeName}
        />

        <Field>
          <Control>
            <Button
              isLight={color !== "primary"}
              isOutlined={color === "primary"}
              color={color}
              isLoading={isLoading}
            >
              <FormattedMessage id="CreateStrategy.button" />
            </Button>
          </Control>
        </Field>
      </Form>
    </Container>
  );
};
