import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Title,
  useToast,
} from "@ggbot2/design";
import { FC, useCallback, useContext, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ApiKey } from "../components/ApiKey.js";
import { BinanceApiKeyPermissions } from "../components/BinanceApiKeyPermissions.js";
import { BinanceApiConfigContext } from "../contexts/BinanceApiConfig.js";
import { useApi } from "../hooks/useApi.js";

export const BinanceApi: FC = () => {
  const { formatMessage } = useIntl();
  const { toast } = useToast();
  const { apiKey } = useContext(BinanceApiConfigContext);

  const READ = useApi.ReadBinanceApiKeyPermissions();
  const isLoading = READ.isPending;
  const permissions = READ.data;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (READ.canRun) READ.request();
    },
    [READ]
  );

  useEffect(() => {
    if (READ.error) {
      READ.reset();
      toast.warning(formatMessage({ id: "BinanceApi.error" }));
    }
  }, [READ, formatMessage, toast]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="BinanceApi.title" />
      </Title>

      <ApiKey isStatic value={apiKey} />

      <Field>
        <Control>
          <Button isLoading={isLoading}>
            <FormattedMessage id="BinanceApi.test" />
          </Button>
        </Control>
      </Field>

      <BinanceApiKeyPermissions permissions={permissions} />
    </Form>
  );
};
