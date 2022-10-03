import { Button, Field, Fieldset } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";

export const BinanceSettings: FC = () => {
  const apiKeyLabel = "API Key";

  const [create, { isPending: createIsPending }] =
    useApiAction.CREATE_BINANCE_API_CONFIG();

  const [read, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.READ_BINANCE_API_CONFIG();

  const hasBinanceApiConfig = useMemo(
    () => typeof binanceApiConfig !== "undefined" && binanceApiConfig !== null,
    [binanceApiConfig]
  );

  const hasNoBinanceApiConfig = useMemo(
    () => typeof binanceApiConfig !== "undefined" && binanceApiConfig === null,
    [binanceApiConfig]
  );

  const isPending = useMemo(
    () => createIsPending || readIsPending,
    [createIsPending, readIsPending]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (createIsPending || readIsPending) return;

      if (hasBinanceApiConfig) {
        // TODO test button
      }

      if (hasNoBinanceApiConfig) {
        const {
          apiKey: { value: apiKey },
          apiSecret: { value: apiSecret },
        } = event.target as EventTarget & {
          apiKey: { value: string };
          apiSecret: { value: string };
        };
        create({ data: { apiKey, apiSecret } });
      }
    },
    [
      create,
      createIsPending,
      hasBinanceApiConfig,
      hasNoBinanceApiConfig,
      readIsPending,
    ]
  );

  useEffect(() => {
    read();
  }, [read]);

  return (
    <form onSubmit={onSubmit}>
      <Fieldset legend="Binance API">
        {hasBinanceApiConfig ? (
          <dl>
            <dt>{apiKeyLabel}</dt>
            <dd>{binanceApiConfig?.apiKey}</dd>
          </dl>
        ) : (
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
          <Button isSpinning={createIsPending}>create</Button>
        )}
      </menu>
    </form>
  );
};
