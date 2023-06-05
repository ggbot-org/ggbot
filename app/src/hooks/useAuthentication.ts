import { isAccount } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { localStorage } from "../storages/local.js";

export const useAuthentication = () => {
  const [READ, response] = useApi.ReadAccount();

  let hasSession: boolean | undefined;

  const { data, isPending } = response;
  const responseNotOk = response.aborted || response.error;

  if (data === null) {
    hasSession = false;
    localStorage.email = undefined;
  }

  if (isAccount(data)) {
    hasSession = true;
    localStorage.email = data.email;
  }

  useEffect(() => {
    if (hasSession || isPending || responseNotOk) return;
    const controller = READ({});
    return () => controller.abort();
  }, [READ, hasSession, isPending, responseNotOk]);

  return {
    hasSession,
  };
};
