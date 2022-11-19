import { Button, Fieldset, InputField } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback, useEffect, useMemo } from "react";
import { useApiAction } from "_hooks";

const apiKeyField = {
  label: "API Key",
  name: "apiKey",
};
const apiSecretField = { label: "API Secret", name: "apiSecret" };

const PermissionCheck: FC<{ label: string; ok: boolean | undefined }> = ({
  label,
  ok,
}) =>
  ok === undefined ? null : (
    <span className={ok ? "text-cyan-400" : "text-yellow-400"}>
      {label} {ok ? "✓" : "✗"}
    </span>
  );

export const BinanceSettings: FC = () => {
  const [readConfig, { data: binanceApiConfig, isPending: readIsPending }] =
    useApiAction.READ_BINANCE_API_CONFIG();
  const [createConfig, { isPending: createIsPending }] =
    useApiAction.CREATE_BINANCE_API_CONFIG();
  const [testConfig, { data: permissions, isPending: testIsPending }] =
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

      if (hasBinanceApiConfig) testConfig();

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
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit}>
        <Fieldset legend="Binance API">
          {hasBinanceApiConfig && (
            <>
              <InputField
                {...apiKeyField}
                readOnly
                defaultValue={binanceApiConfig?.apiKey}
              />
              <menu className="mb-8">
                <li>
                  <Button isSpinning={testIsPending}>test</Button>
                </li>
              </menu>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>
                    is <em>reading</em> permission enabled?
                  </span>
                  <PermissionCheck
                    label={String(permissions?.enableReading)}
                    ok={permissions?.enableReading}
                  />
                </div>

                <div className="flex justify-between">
                  <span>
                    are <em>withdrawals</em> enabled?
                  </span>
                  <PermissionCheck
                    label={String(permissions?.enableWithdrawals)}
                    ok={
                      typeof permissions?.enableWithdrawals === "boolean"
                        ? !permissions?.enableWithdrawals
                        : undefined
                    }
                  />
                </div>

                <div className="flex justify-between">
                  <span>
                    is <em>Spot and Margin</em> enabled?
                  </span>
                  <PermissionCheck
                    label={String(permissions?.enableSpotAndMarginTrading)}
                    ok={permissions?.enableSpotAndMarginTrading}
                  />
                </div>

                <div className="flex justify-between">
                  <span>
                    is <em>static IP</em> restriction activated?
                  </span>
                  <PermissionCheck
                    label={String(permissions?.ipRestrict)}
                    ok={permissions?.ipRestrict}
                  />
                </div>
              </div>
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

      <form>
        <Fieldset color="danger" legend="Danger zone">
          <menu>
            <li>
              <Button color="danger">Delete Account</Button>
            </li>
          </menu>
        </Fieldset>
      </form>
    </div>
  );
};
