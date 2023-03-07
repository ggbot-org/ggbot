import { isBinanceApiKeyPermission } from "@ggbot2/binance";
import {
  Button,
  Checkmark,
  CheckmarkProps,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Title,
} from "@ggbot2/design";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { useApiAction } from "_hooks";
import { fieldLabel } from "_i18n";

type Props = {
  apiKey: string;
};

export const BinanceApi: FC<Props> = ({ apiKey }) => {
  const [testConfig, { data: permissions, isPending }] = useApiAction.ReadBinanceApiKeyPermissions();

  const { enableSpotAndMarginTrading, enableWithdrawals, enableReading, ipRestrict } = useMemo(
    () =>
      isBinanceApiKeyPermission(permissions)
        ? permissions
        : {
            enableSpotAndMarginTrading: undefined,
            enableWithdrawals: undefined,
            enableReading: undefined,
            ipRestrict: undefined,
          },
    [permissions]
  );

  const permissionItems: {
    description: ReactNode;
    checkmark: CheckmarkProps;
  }[] = useMemo(
    () => [
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
          ok: typeof enableWithdrawals === "boolean" ? enableWithdrawals === false : undefined,
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
    ],
    [enableSpotAndMarginTrading, enableWithdrawals, enableReading, ipRestrict]
  );

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;

      testConfig({});
    },
    [testConfig, isPending]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Title>Binance API</Title>

      <InputField label={fieldLabel.apiKey} defaultValue={apiKey} readOnly />

      <Field>
        <Control>
          <Button isLoading={isPending}>Test</Button>
        </Control>
      </Field>

      <div>
        {permissionItems.map(({ description, checkmark: checkmarkProps }, i) => (
          <div key={i}>
            {description}
            <Checkmark {...checkmarkProps} />
          </div>
        ))}
      </div>
    </Form>
  );
};
