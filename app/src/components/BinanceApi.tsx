import {
  BinanceApiKeyPermission,
  isBinanceApiKeyPermission,
} from "@ggbot2/binance";
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
import {
  BinanceApiKeyPermissionEnableReading,
  BinanceApiKeyPermissionEnableSpotAndMarginTrading,
  BinanceApiKeyPermissionEnableWithdrawals,
  BinanceApiKeyPermissionIpRestrict,
} from "../components/BinanceApiKeyPermissions.js";
import { BinanceApiConfigContext } from "../contexts/BinanceApiConfig.js";
import { useApi } from "../hooks/useApi.js";

export const BinanceApi: FC = () => {
  const { apiKey, hasApiKey } = useContext(BinanceApiConfigContext);

  const READ = useApi.ReadBinanceApiKeyPermissions();
  const permissions = READ.data;
  const isLoading = READ.isPending;

  let enableSpotAndMarginTrading:
    | BinanceApiKeyPermission["enableSpotAndMarginTrading"]
    | undefined;
  let enableWithdrawals:
    | BinanceApiKeyPermission["enableWithdrawals"]
    | undefined;
  let enableReading: BinanceApiKeyPermission["enableReading"] | undefined;
  let ipRestrict: BinanceApiKeyPermission["ipRestrict"] | undefined;

  if (isBinanceApiKeyPermission(permissions)) {
    enableSpotAndMarginTrading = permissions.enableSpotAndMarginTrading;
    enableWithdrawals = permissions.enableWithdrawals;
    enableReading = permissions.enableReading;
    ipRestrict = permissions.ipRestrict;
  }

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (READ.canRun) READ.request();
    },
    [READ]
  );

  if (!hasApiKey) return null;

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="BinanceApi.title" />
      </Title>

      <ApiKey readOnly truncated value={apiKey} />

      <Field>
        <Control>
          <Button isLoading={isLoading}>
            <FormattedMessage id="BinanceApi.test" />
          </Button>
        </Control>
      </Field>

      <div>
        <BinanceApiKeyPermissionEnableReading enableReading={enableReading} />

        <BinanceApiKeyPermissionEnableWithdrawals
          enableWithdrawals={enableWithdrawals}
        />

        <BinanceApiKeyPermissionEnableSpotAndMarginTrading
          enableSpotAndMarginTrading={enableSpotAndMarginTrading}
        />

        <BinanceApiKeyPermissionIpRestrict ipRestrict={ipRestrict} />
      </div>
    </Form>
  );
};
