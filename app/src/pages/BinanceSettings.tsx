import { Column, Columns } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useEffect, useState } from "react";

import { BinanceApi } from "../components/BinanceApi.js";
import { CreateBinanceApi } from "../components/CreateBinanceApi.js";
import { DeleteBinanceApi } from "../components/DeleteBinanceApi.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { useApi } from "../hooks/useApi.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

const hideApiKey = (apiKey: string) =>
  `${apiKey.substring(0, 10)}...${apiKey.substring(
    apiKey.length - 10,
    apiKey.length
  )}`;

export const BinanceSettingsPage: FC = () => {
  const READ = useApi.ReadBinanceApiConfig();
  const apiConfig = READ.data;
  const refetchApiKey = READ.reset;

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  useEffect(() => {
    if (isMaybeObject<Pick<BinanceApiConfig, "apiKey">>(apiConfig)) {
      const { apiKey } = apiConfig;
      if (typeof apiKey === "string") setApiKey(hideApiKey(apiKey));
    }
  }, [apiConfig]);

  if (apiConfig === undefined) return <OneSectionLayout />;

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

          {apiKey ? <DeleteBinanceApi onDelete={refetchApiKey} /> : null}
        </OneSectionLayout>
      </AuthenticationProvider>
    </I18nContextProvider>
  );
};
