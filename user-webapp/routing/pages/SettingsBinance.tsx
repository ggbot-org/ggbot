import { Column, Columns } from "@ggbot2/design";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useEffect, useMemo } from "react";
import { BinanceApi, CreateBinanceApi, DeleteBinanceApi } from "_components";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";

const hideApiKey = (apiKey: string) =>
  `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10, apiKey.length)}`;

export const SettingsBinancePage: FC = () => {
  const [readConfig, { data: binanceApiConfig }] = useApiAction.ReadBinanceApiConfig();

  const { apiKey, hasBinanceApiConfig } = useMemo<{
    apiKey: string;
    hasBinanceApiConfig: boolean | undefined;
  }>(() => {
    if (binanceApiConfig === undefined)
      return {
        apiKey: "",
        hasBinanceApiConfig: undefined,
      };

    if (
      isMaybeObject<Pick<BinanceApiConfig, "apiKey">>(binanceApiConfig) &&
      typeof binanceApiConfig.apiKey === "string"
    ) {
      return {
        apiKey: hideApiKey(binanceApiConfig.apiKey),
        hasBinanceApiConfig: true,
      };
    }
    return {
      apiKey: "",
      hasBinanceApiConfig: false,
    };
  }, [binanceApiConfig]);

  useEffect(() => {
    const controller = readConfig({});
    return () => {
      controller.abort();
    };
  }, [readConfig]);

  if (binanceApiConfig === undefined) return <OneSectionLayout />;

  return (
    <OneSectionLayout>
      <Columns>
        <Column size="half">
          {hasBinanceApiConfig ? <BinanceApi apiKey={apiKey} /> : <CreateBinanceApi />}
        </Column>
      </Columns>

      {hasBinanceApiConfig && <DeleteBinanceApi />}
    </OneSectionLayout>
  );
};
