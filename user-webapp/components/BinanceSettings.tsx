import { Button, Field, Fieldset } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";

export const BinanceSettings: FC = () => {
  const apiKeyLabel = "API Key";

  const [readConfig, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.READ_BINANCE_API_CONFIG();
  const [createConfig, { isPending: createIsPending }] =
    useApiAction.CREATE_BINANCE_API_CONFIG();
  const [testConfig, { isPending: testIsPending }] =
    useApiAction.READ_BINANCE_API_KEY_PERMISSIONS();

  const hasBinanceApiConfig = useMemo(
    () => typeof binanceApiConfig !== "undefined" && binanceApiConfig !== null,
    [binanceApiConfig]
  );

  const hasNoBinanceApiConfig = useMemo(
    () => typeof binanceApiConfig !== "undefined" && binanceApiConfig === null,
    [binanceApiConfig]
  );

  const isPending = useMemo(
    () => createIsPending || readIsPending || testIsPending,
    [createIsPending, readIsPending, testIsPending]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;

      if (hasBinanceApiConfig) {
        testConfig({});
      }

      if (hasNoBinanceApiConfig) {
        const {
          apiKey: { value: apiKey },
          apiSecret: { value: apiSecret },
        } = event.target as EventTarget & {
          apiKey: { value: string };
          apiSecret: { value: string };
        };
        createConfig({ data: { apiKey, apiSecret } });
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

  useEffect(readConfig, [readConfig]);

  return (
    <form onSubmit={onSubmit}>
      <Fieldset legend="Binance API">
        {hasBinanceApiConfig && (
          <dl>
            <dt>{apiKeyLabel}</dt>
            <dd>{binanceApiConfig?.apiKey}</dd>
          </dl>
        )}
        {hasNoBinanceApiConfig && (
          <>
            <Field
              label={apiKeyLabel}
              name="apiKey"
              required
              readOnly={isPending}
            />
            <Field
              label="Secret Key"
              name="apiSecret"
              required
              readOnly={isPending}
            />
          </>
        )}
      </Fieldset>
      <menu>
        {hasNoBinanceApiConfig && (
          <li>
            <Button isSpinning={createIsPending}>create</Button>
          </li>
        )}
        {hasBinanceApiConfig && (
          <li>
            <Button isSpinning={testIsPending}>test</Button>
          </li>
        )}
      </menu>
    </form>
  );
};
