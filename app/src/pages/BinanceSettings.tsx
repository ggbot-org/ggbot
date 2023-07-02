import { Column, Columns } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useCallback, useEffect, useState } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { BinanceApi } from "../components/BinanceApi.js";
import { CreateBinanceApi } from "../components/CreateBinanceApi.js";
import { DeleteBinanceApi } from "../components/DeleteBinanceApi.js";
import { useApi } from "../hooks/useApi.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

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
    <I18nContextProvider>
      <AuthenticationProvider>
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
      </AuthenticationProvider>
    </I18nContextProvider>
  );
};
