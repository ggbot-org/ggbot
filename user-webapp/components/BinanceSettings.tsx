import { Button, Fieldset, InputField } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";

const apiKeyField = {
  label: "API Key",
  name: "apiKey",
};
const apiSecretField = { label: "API Secret", name: "apiSecret" };

export const BinanceSettings: FC = () => {
  const [readConfig, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.READ_BINANCE_API_CONFIG();
  const [createConfig, { isPending: createIsPending }] =
    useApiAction.CREATE_BINANCE_API_CONFIG();
  const [testConfig, { isPending: testIsPending }] =
    useApiAction.READ_BINANCE_API_KEY_PERMISSIONS();

  const hasBinanceApiConfig = useMemo(
    () => binanceApiConfig !== undefined && binanceApiConfig !== null,
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
          <>
            <InputField
              {...apiKeyField}
              readOnly
              defaultValue={binanceApiConfig?.apiKey}
            />
            <menu>
              <li>
                <Button isSpinning={testIsPending}>test</Button>
              </li>
            </menu>
          </>
        )}
        {hasNoBinanceApiConfig && (
          <>
            <InputField {...apiKeyField} required readOnly={isPending} />
            <InputField {...apiSecretField} required readOnly={isPending} />
            <menu>
              <li>
                <Button isSpinning={createIsPending}>create</Button>
              </li>
            </menu>
          </>
        )}
      </Fieldset>
    </form>
  );
};
