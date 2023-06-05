import { createContext } from "react";

import { useAuthentication } from "../hooks/useAuthentication.js";

type ContextValue = ReturnType<typeof useAuthentication>;

export const AuthenticationContext = createContext<ContextValue>({
  hasSession: undefined,
});

AuthenticationContext.displayName = "AuthenticationContext";
