import { Button, Control, Field, Form, FormOnSubmit, InputField, Title } from "@ggbot2/design";
import { FC, useCallback } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel } from "_i18n";

export const CreateBinanceApi: FC = () => {
  const [createConfig, { isPending }] = useApiAction.CreateBinanceApiConfig();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;

      const {
        apiKey: { value: apiKey },
        apiSecret: { value: apiSecret },
      } = event.target as EventTarget & {
        apiKey: { value: string };
        apiSecret: { value: string };
      };
      createConfig({ apiKey, apiSecret });
    },
    [createConfig, isPending]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Title>Binance API</Title>

      <InputField name="apiKey" label={fieldLabel.apiKey} required readOnly={isPending} />

      <InputField label={fieldLabel.apiSecret} name="apiSecret" required readOnly={isPending} />

      <Field>
        <Control>
          <Button isLoading={isPending}>{buttonLabel.create}</Button>
        </Control>
      </Field>
    </Form>
  );
};
