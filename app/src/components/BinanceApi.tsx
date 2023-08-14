import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { ApiKey } from "../components/ApiKey.js";
import { BinanceApiKeyPermissions } from "../components/BinanceApiKeyPermissions.js";
import { BinanceApiConfigContext } from "../contexts/BinanceApiConfig.js";
import { useApi } from "../hooks/useApi.js";

export const BinanceApi: FC = () => {
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
