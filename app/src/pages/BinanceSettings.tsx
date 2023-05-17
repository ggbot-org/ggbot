import { BinanceApi } from "_components/BinanceApi";
import { CreateBinanceApi } from "_components/CreateBinanceApi";
import { DeleteBinanceApi } from "_components/DeleteBinanceApi";
import { useApi } from "_hooks/useApi";
import { OneSectionLayout } from "_layouts/OneSection";
import { Column, Columns } from "@ggbot2/design";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useCallback, useEffect, useState } from "react";

const hideApiKey = (apiKey: string) =>
  `${apiKey.substring(0, 10)}...${apiKey.substring(
    apiKey.length - 10,
    apiKey.length
  )}`;

export const BinanceSettingsPage: FC = () => {
  const [READ, { data }] = useApi.ReadBinanceApiConfig();

  const [apiKey, setApiKey] = useState("");
  const [fetchCounter, setFetchCounter] = useState(1);

  const refetchApiKey = useCallback(() => {
    setFetchCounter((counter) => counter + 1);
  }, []);

  const resetApiKey = useCallback(() => {
    setApiKey("");
  }, []);

  useEffect(() => {
    if (!fetchCounter) return;
    const controller = READ({});
    return () => controller.abort();
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

      {apiKey ? <DeleteBinanceApi onDelete={resetApiKey} /> : null}
    </OneSectionLayout>
  );
};
