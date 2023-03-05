import { isBinanceApiKeyPermission } from "@ggbot2/binance";
import {
  Button,
  ButtonOnClick,
  Checkmark,
  CheckmarkProps,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Title,
} from "@ggbot2/design";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const BinanceSettings: FC = () => {
  const router = useRouter();

  const apiKeyLabel = "API key";

  const [readConfig, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.ReadBinanceApiConfig();
  const [createConfig, { isPending: createIsPending }] = useApiAction.CreateBinanceApiConfig();
  const [testConfig, { data: permissions, isPending: testIsPending }] =
    useApiAction.ReadBinanceApiKeyPermissions();

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

  const { currentApiKey, hasBinanceApiConfig } = useMemo(() => {
    if (isMaybeObject<BinanceApiConfig>(binanceApiConfig) && typeof binanceApiConfig.apiKey === "string") {
      const { apiKey } = binanceApiConfig;
      return {
        currentApiKey: `${apiKey.substring(0, 10)}...${apiKey.substring(
          apiKey.length - 10,
          apiKey.length
        )}`,
        hasBinanceApiConfig: true,
      };
    }
    return {
      currentApiKey: "",
      hasBinanceApiConfig: false,
    };
  }, [binanceApiConfig]);

  const hasNoBinanceApiConfig = useMemo(
    () => binanceApiConfig !== undefined && binanceApiConfig === null,
    [binanceApiConfig]
  );

  const isPending = useMemo(
    () => createIsPending || readIsPending || testIsPending,
    [createIsPending, readIsPending, testIsPending]
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

      if (hasBinanceApiConfig) testConfig({});

      if (hasNoBinanceApiConfig) {
        const {
          apiKey: { value: apiKey },
          apiSecret: { value: apiSecret },
        } = event.target as EventTarget & {
          apiKey: { value: string };
          apiSecret: { value: string };
        };
        createConfig({ apiKey, apiSecret });
      }
    },
    [createConfig, testConfig, hasBinanceApiConfig, hasNoBinanceApiConfig, isPending]
  );

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      router.push(route.deleteBinanceApiConfigPage());
    },
    [router]
  );

  useEffect(() => {
    const controller = readConfig({});
    return () => {
      controller.abort();
    };
  }, [readConfig]);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Title>Binance API</Title>

        {hasBinanceApiConfig && (
          <>
            <InputField label={apiKeyLabel} defaultValue={currentApiKey} readOnly />

            <Field>
              <Control>
                <Button isLoading={testIsPending}>Test</Button>
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
          </>
        )}

        {hasNoBinanceApiConfig && (
          <>
            <InputField name="apiKey" label={apiKeyLabel} required readOnly={isPending} />
            <InputField label="API Secret" name="apiSecret" required readOnly={isPending} />
            <Button isLoading={createIsPending}>Create</Button>
          </>
        )}
      </Form>

      {hasBinanceApiConfig ? (
        <Button color="danger" onClick={onClickDelete}>
          Delete API key
        </Button>
      ) : null}
    </>
  );
};
