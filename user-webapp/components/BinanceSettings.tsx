import { Button, Field, Fieldset } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useMemo, useState } from "react";
import { ApiAction, useApiAction } from "_hooks";

export const BinanceSettings: FC = () => {
  const apiKeyLabel = "API Key";

  const [newBinanceApiConfig, setNewBinanceApiConfig] =
    useState<ApiAction["CREATE_BINANCE_API_CONFIG"]["in"]>();

  const { isLoading: createIsLoading } =
    useApiAction.CREATE_BINANCE_API_CONFIG(newBinanceApiConfig);

  const { data: binanceApiConfig, isLoading: readIsLoading } =
    useApiAction.READ_BINANCE_API_CONFIG();

  const hasBinanceApiConfig = useMemo(
    () => typeof binanceApiConfig !== "undefined",
    [binanceApiConfig]
  );

  const isLoading = useMemo(
    () => createIsLoading || readIsLoading,
    [createIsLoading, readIsLoading]
  );

  const submitLabel = useMemo(
    () => (hasBinanceApiConfig ? "test" : "save"),
    [hasBinanceApiConfig]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isLoading) return;

      if (hasBinanceApiConfig) {
      } else {
        const {
          apiKey: { value: apiKey },
          apiSecret: { value: apiSecret },
        } = event.target as EventTarget & {
          apiKey: { value: string };
          apiSecret: { value: string };
        };
        setNewBinanceApiConfig({ apiKey, apiSecret });
      }
    },
    [hasBinanceApiConfig, isLoading]
  );

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
              readOnly={isLoading}
            />
            <Field
              label="Secret Key"
              name="apiSecret"
              required
              readOnly={isLoading}
            />
          </>
        )}
      </Fieldset>
      <menu>
        <Button isLoading={isLoading}>{submitLabel}</Button>
      </menu>
    </form>
  );
};
