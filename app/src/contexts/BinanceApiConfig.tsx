import { BinanceApiKey } from "@ggbot2/models";
import { sessionWebStorage } from "@ggbot2/web-storage";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";

import { useApi } from "../hooks/useApi.js";

type ContextValue = Partial<BinanceApiKey> & {
  hasApiKey: undefined | boolean;
  refetchApiKey: () => void;
};

export const BinanceApiConfigContext = createContext<ContextValue>({
  hasApiKey: undefined,
  apiKey: undefined,
  refetchApiKey: () => {},
});

BinanceApiConfigContext.displayName = "BinanceApiConfigContext";

export const BinanceApiConfigProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const READ_API_KEY = useApi.ReadBinanceApiKey();
  const remoteApiKey = READ_API_KEY.data;
  const refetchApiKey = READ_API_KEY.reset;

  const contextValue = useMemo<ContextValue>(() => {
    const localApiKey = sessionWebStorage.binanceApiKey;
    const apiKey = localApiKey
      ? localApiKey.apiKey
      : remoteApiKey === undefined
      ? undefined
      : remoteApiKey?.apiKey ?? "";
    return {
      apiKey,
      hasApiKey: apiKey === undefined ? undefined : Boolean(apiKey),
      refetchApiKey,
    };
  }, [remoteApiKey, refetchApiKey]);

  // Fetch apiKey.
  useEffect(() => {
    if (READ_API_KEY.canRun) READ_API_KEY.request();
  }, [READ_API_KEY]);

  // Cache apiKey.
  useEffect(() => {
    if (remoteApiKey) sessionWebStorage.binanceApiKey = remoteApiKey;
    if (remoteApiKey === null) sessionWebStorage.binanceApiKey = undefined;
  }, [remoteApiKey]);

  return (
    <BinanceApiConfigContext.Provider value={contextValue}>
      {children}
    </BinanceApiConfigContext.Provider>
  );
};
