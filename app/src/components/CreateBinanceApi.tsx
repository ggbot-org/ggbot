import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { ApiKey } from "../components/ApiKey.js";
import { ApiSecret } from "../components/ApiSecret.js";
import { useApi } from "../hooks/useApi.js";

type Props = {
  onCreate: () => void;
};

const fields = ["apiKey", "apiSecret"] as const;

export const CreateBinanceApi: FC<Props> = ({ onCreate }) => {
  const CREATE = useApi.CreateBinanceApiConfig();
  const isLoading = CREATE.isPending;
  const readOnly = CREATE.isPending;
  const isDone = CREATE.isDone;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!CREATE.canRun) return;
      const { apiKey, apiSecret } = formValues(event, fields);
      if (typeof apiKey !== "string") return;
      if (typeof apiSecret !== "string") return;
      CREATE.request({ apiKey, apiSecret });
    },
    [CREATE]
  );

  useEffect(() => {
    if (isDone) onCreate();
  }, [isDone, onCreate]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="CreateBinanceApi.title" />
      </Title>

      <ApiKey required name="apiKey" readOnly={readOnly} />

      <ApiSecret required name="apiSecret" readOnly={readOnly} />

      <Field>
        <Control>
          <Button isLoading={isLoading}>
            <FormattedMessage id="CreateBinanceApi.button" />
          </Button>
        </Control>
      </Field>
    </Form>
  );
  // TODO error feedback
};
