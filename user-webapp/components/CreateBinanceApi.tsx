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
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel } from "_i18n";

type Props = {
  onCreate: () => void;
};

const fields = ["apiKey", "apiSecret"] as const;

export const CreateBinanceApi: FC<Props> = ({ onCreate }) => {
  const [CREATE, { data, isPending }] = useApiAction.CreateBinanceApiConfig();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;

      const { apiKey, apiSecret } = formValues(event, fields);
      if (typeof apiKey !== "string") return;
      if (typeof apiSecret !== "string") return;
      CREATE({ apiKey, apiSecret });
    },
    [CREATE, isPending]
  );

  useEffect(() => {
    if (!data) return;
    onCreate();
  }, [data, onCreate]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>Binance API</Title>

      <InputField
        name="apiKey"
        label={fieldLabel.apiKey}
        required
        readOnly={isPending}
      />

      <InputField
        label={fieldLabel.apiSecret}
        name="apiSecret"
        required
        readOnly={isPending}
      />

      <Field>
        <Control>
          <Button isLoading={isPending}>{buttonLabel.create}</Button>
        </Control>
      </Field>
    </Form>
  );
};
