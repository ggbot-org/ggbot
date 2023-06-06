import { isAccount } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { local } from "../storages/local.js";

export const useAuthentication = () => {
  const [READ, { data, isPending, error, aborted }] = useApi.ReadAccount();

  let hasSession: boolean | undefined;
  let email = local.email;

  if (error || aborted) hasSession = false;

  if (data === null) {
    hasSession = false;
    local.email = undefined;
  }

  if (isAccount(data)) {
    hasSession = true;

    email = data.email;
    local.email = email;
  }

  useEffect(() => {
    if (hasSession || isPending || aborted || error) return;
    const controller = READ({});
    return () => controller.abort();
  }, [READ, aborted, error, hasSession, isPending]);

  return {
    email,
    hasSession,
  };
};
