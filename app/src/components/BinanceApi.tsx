import {
  BinanceApiKeyPermission,
  isBinanceApiKeyPermission,
} from "@ggbot2/binance";
import {
  Button,
  Checkmark,
  CheckmarkProps,
  Control,
  Field,
  Form,
  FormOnSubmit,
  OutputField,
  Title,
} from "@ggbot2/design";
import { FC, ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useApi } from "../hooks/useApi.js";
import { fieldLabel } from "../i18n/index.js";

type Props = {
  apiKey: string;
};

export const BinanceApi: FC<Props> = ({ apiKey }) => {
  const {
    request: READ,
    data: permissions,
    isPending,
  } = useApi.ReadBinanceApiKeyPermissions();

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

  const permissionItems: {
    description: ReactNode;
    checkmark: CheckmarkProps;
    key: keyof BinanceApiKeyPermission;
  }[] = [
    {
      key: "enableReading",
      checkmark: {
        label: String(enableReading),
        ok: enableReading,
      },
      description: (
        <span>
          is <em>reading</em> permission enabled?
        </span>
      ),
    },
    {
      key: "enableWithdrawals",
      checkmark: {
        label: String(enableWithdrawals),
        ok:
          typeof enableWithdrawals === "boolean"
            ? enableWithdrawals === false
            : undefined,
      },
      description: (
        <span>
          are <em>withdrawals</em> enabled?
        </span>
      ),
    },
    {
      key: "enableSpotAndMarginTrading",
      checkmark: {
        label: String(enableSpotAndMarginTrading),
        ok: enableSpotAndMarginTrading,
      },
      description: (
        <span>
          is <em>Spot and Margin</em> enabled?
        </span>
      ),
    },
    {
      key: "ipRestrict",
      checkmark: {
        label: String(ipRestrict),
        ok: ipRestrict,
      },
      description: (
        <span>
          is <em>static IP</em> restriction activated?
        </span>
      ),
    },
  ];

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      READ({});
    },
    [READ]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="BinanceApi.title" />
      </Title>

      <OutputField label={fieldLabel.apiKey} value={apiKey} />

      <Field>
        <Control>
          <Button isLoading={isPending}>Test</Button>
        </Control>
      </Field>

      <div>
        {permissionItems.map(
          ({ key, description, checkmark: checkmarkProps }) => (
            <div key={key}>
              {description}

              <Checkmark {...checkmarkProps} />
            </div>
          )
        )}
      </div>
    </Form>
  );
};
