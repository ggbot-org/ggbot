import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputField,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel, fieldLabel } from "../i18n/index.js";

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

      <InputField
        required
        name="apiKey"
        label={fieldLabel.apiKey}
        readOnly={readOnly}
      />

      <InputField
        required
        label={fieldLabel.apiSecret}
        name="apiSecret"
        readOnly={readOnly}
      />

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
