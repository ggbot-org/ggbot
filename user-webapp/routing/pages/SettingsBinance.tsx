import { Column, Columns } from "@ggbot2/design";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useCallback, useEffect, useState } from "react";
import { BinanceApi, CreateBinanceApi, DeleteBinanceApi } from "_components";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";

const hideApiKey = (apiKey: string) =>
  `${apiKey.substring(0, 10)}...${apiKey.substring(
    apiKey.length - 10,
    apiKey.length
  )}`;

export const SettingsBinancePage: FC = () => {
  const [READ, { data }] = useApiAction.ReadBinanceApiConfig();

  const [apiKey, setApiKey] = useState("");
  const [fetchCounter, setFetchCounter] = useState(1);

  const refetchApiKey = useCallback(() => {
    setFetchCounter((counter) => counter + 1);
  }, []);

  const resetApiKey = useCallback(() => {
    setApiKey("");
  }, []);
  console.log("apiKey", apiKey);

  useEffect(() => {
    if (!fetchCounter) return;
    const controller = READ({});
    return () => {
      controller.abort();
    };
  }, [READ, fetchCounter]);

  useEffect(() => {
    if (isMaybeObject<Pick<BinanceApiConfig, "apiKey">>(data)) {
      const { apiKey } = data;
      if (typeof apiKey === "string") setApiKey(hideApiKey(apiKey));
    }
  }, [data]);

  if (data === undefined) return <OneSectionLayout />;

  return (
    <OneSectionLayout>
      <Columns>
        <Column size="half">
          {apiKey ? (
            <BinanceApi apiKey={apiKey} />
          ) : (
            <CreateBinanceApi onCreate={refetchApiKey} />
          )}
        </Column>
      </Columns>

      {apiKey && <DeleteBinanceApi onDelete={resetApiKey} />}
    </OneSectionLayout>
  );
};
