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
import { useApi } from "_hooks/useApi";
import { fieldLabel } from "_i18n";

type Props = {
  apiKey: string;
};

export const BinanceApi: FC<Props> = ({ apiKey }) => {
  const [READ, { data: permissions, isPending }] =
    useApi.ReadBinanceApiKeyPermissions();

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
  }[] = [
    {
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
      if (isPending) return;
      READ({});
    },
    [READ, isPending]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <Title>Binance API</Title>

      <OutputField label={fieldLabel.apiKey} value={apiKey} />

      <Field>
        <Control>
          <Button isLoading={isPending}>Test</Button>
        </Control>
      </Field>

      <div>
        {permissionItems.map(
          ({ description, checkmark: checkmarkProps }, i) => (
            <div key={i}>
              {description}

              <Checkmark {...checkmarkProps} />
            </div>
          )
        )}
      </div>
    </Form>
  );
};