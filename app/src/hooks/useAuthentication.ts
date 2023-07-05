import { isAccount } from "@ggbot2/models";
import { useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { localStorage } from "../storages/local.js";
import { sessionStorage } from "../storages/session.js";

export const useAuthentication = () => {
  const [READ, { data, isPending, error, aborted }] = useApi.ReadAccount();

  let hasSession: boolean | undefined = sessionStorage.hasSession;
  let email = localStorage.email;

  if (error || aborted) hasSession = false;

  if (data === null) {
    hasSession = false;
    localStorage.email = undefined;
  }

  if (isAccount(data)) {
    hasSession = true;
    sessionStorage.hasSession = true;

    email = data.email;
    localStorage.email = email;
  }

  useEffect(() => {
    if (hasSession || isPending || error) return;
    READ({});
  }, [READ, error, hasSession, isPending]);

  return {
    email,
    hasSession,
  };
};
