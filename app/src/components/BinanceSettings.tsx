import { Column, Columns } from "@ggbot2/design";
import { BinanceApiConfig } from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { FC, useEffect, useState } from "react";

import { BinanceApi } from "../components/BinanceApi.js";
import { CreateBinanceApi } from "../components/CreateBinanceApi.js";
import { DeleteBinanceApi } from "../components/DeleteBinanceApi.js";
import { useApi } from "../hooks/useApi.js";

export const BinanceSettings: FC = () => {
  const READ = useApi.ReadBinanceApiConfig();
  const apiConfig = READ.data;
  const refetchApiKey = READ.reset;

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  useEffect(() => {
    // TODO isReadBinanceApiConfigOutput
    if (isMaybeObject<Pick<BinanceApiConfig, "apiKey">>(apiConfig)) {
      const { apiKey } = apiConfig;
      if (typeof apiKey === "string") setApiKey(apiKey);
    }
  }, [apiConfig]);

  return (
    <>
      <Columns>
        <Column size="half">
          {apiKey ? (
            <BinanceApi apiKey={apiKey} />
          ) : (
            <CreateBinanceApi onCreate={refetchApiKey} />
          )}
        </Column>
      </Columns>

      {apiConfig ? <DeleteBinanceApi onDelete={refetchApiKey} /> : null}
    </>
  );
};
