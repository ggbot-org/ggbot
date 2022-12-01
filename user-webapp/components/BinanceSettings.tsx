import { isBinanceApiKeyPermission } from "@ggbot2/binance";
import {
  Button,
  ButtonOnClick,
  Checkmark,
  CheckmarkProps,
  Fieldset,
  InputField,
  OutputField,
} from "@ggbot2/ui-components";
import { BinanceApiConfig, isMaybeObject } from "@ggbot2/models";
import { useRouter } from "next/router";
import {
  FC,
  FormEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const BinanceSettings: FC = () => {
  const router = useRouter();

  const apiKeyLabel = "API Key";

  const [readConfig, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.READ_BINANCE_API_CONFIG();
  const [createConfig, { isPending: createIsPending }] =
    useApiAction.CREATE_BINANCE_API_CONFIG();
  const [testConfig, { data: permissions, isPending: testIsPending }] =
    useApiAction.READ_BINANCE_API_KEY_PERMISSIONS();

  const {
    enableSpotAndMarginTrading,
    enableWithdrawals,
    enableReading,
    ipRestrict,
  } = useMemo(
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

  const { currentApiKey, hasBinanceApiConfig } = useMemo(
    () =>
      isMaybeObject<BinanceApiConfig>(binanceApiConfig) &&
      typeof binanceApiConfig.apiKey === "string"
        ? {
            currentApiKey: binanceApiConfig.apiKey,
            hasBinanceApiConfig: true,
          }
        : {
            currentApiKey: "",
            hasBinanceApiConfig: false,
          },
    [binanceApiConfig]
  );

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
    ],
    [enableSpotAndMarginTrading, enableWithdrawals, enableReading, ipRestrict]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;

      if (hasBinanceApiConfig) testConfig();

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
    [
      createConfig,
      testConfig,
      hasBinanceApiConfig,
      hasNoBinanceApiConfig,
      isPending,
    ]
  );

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      router.push(route.deleteBinanceApiConfigPage());
    },
    [router]
  );

  useEffect(readConfig, [readConfig]);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit}>
        {hasBinanceApiConfig && (
          <Fieldset legend="Binance API">
            <OutputField label={apiKeyLabel}>{currentApiKey}</OutputField>

            <menu className="mb-8">
              <li>
                <Button isSpinning={testIsPending}>test</Button>
              </li>
            </menu>

            <div className="flex flex-col gap-2">
              {permissionItems.map(
                ({ description, checkmark: checkmarkProps }, i) => (
                  <div key={i} className="flex justify-between">
                    {description}
                    <Checkmark {...checkmarkProps} />
                  </div>
                )
              )}
            </div>
          </Fieldset>
        )}
        {hasNoBinanceApiConfig && (
          <Fieldset legend="New Binance API">
            <InputField
              name="apiKey"
              label={apiKeyLabel}
              required
              readOnly={isPending}
            />
            <InputField
              label="API Secret"
              name="apiSecret"
              required
              readOnly={isPending}
            />
            <menu>
              <li>
                <Button isSpinning={createIsPending}>create</Button>
              </li>
            </menu>
          </Fieldset>
        )}
      </form>

      {hasBinanceApiConfig ? (
        <Fieldset color="danger" legend="Danger zone">
          <menu>
            <li>
              <Button color="danger" onClick={onClickDelete}>
                Delete API key
              </Button>
            </li>
          </menu>
        </Fieldset>
      ) : null}
    </div>
  );
};
