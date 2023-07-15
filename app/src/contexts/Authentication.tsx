import { Modal } from "@ggbot2/design";
import { EmailAddress, isAccount } from "@ggbot2/models";
import { localWebStorage, sessionWebStorage } from "@ggbot2/web-storage";
import {
  createContext,
  FC,
  PropsWithChildren,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";

import { AuthEnterForm } from "../components/AuthEnterForm.js";
import { AuthVerifyForm } from "../components/AuthVerifyForm.js";
import { SplashScreen } from "../components/SplashScreen.js";
import { useApi } from "../hooks/useApi.js";

type State = {
  verified?: boolean | undefined;
};

type ContextValue = Partial<{
  email: string;
  hasSession: boolean;
}>;

export const AuthenticationContext = createContext<ContextValue>({});

AuthenticationContext.displayName = "AuthenticationContext";

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [{ verified }, dispatch] = useReducer<
    Reducer<State, { type: "SET_VERIFIED"; data: Pick<State, "verified"> }>
  >((state, action) => {
    switch (action.type) {
      case "SET_VERIFIED":
        return { ...state, ...action.data };
      default:
        return state;
    }
  }, {});

  let hasSession: boolean | undefined = sessionWebStorage.hasSession;

  const [email, setEmail] = useState<EmailAddress | undefined>(
    localWebStorage.email
  );

  const [showSplashScreen, setShowSplashScreen] = useState(!hasSession);
  setTimeout(() => {
    setShowSplashScreen(false);
  }, 1700);

  const [READ, { data, error, aborted }] = useApi.ReadAccount();

  if (error || aborted) {
    hasSession = false;
    sessionWebStorage.hasSession = undefined;
  }

  if (data === null) {
    hasSession = false;
    localWebStorage.email = undefined;
  }

  if (isAccount(data)) {
    hasSession = true;
    sessionWebStorage.hasSession = true;

    setEmail(data.email);
    localWebStorage.email = email;
  }

  const setVerified = useCallback(() => {
    dispatch({ type: "SET_VERIFIED", data: { verified: true } });
  }, [dispatch]);

  useEffect(() => {
    if (verified !== false) {
      READ({});
    }
  }, [READ, verified]);

  const resetEmail = useCallback(() => {
    localWebStorage.email = undefined;
    setEmail(undefined);
  }, [setEmail]);

  const emailSent = email !== undefined;

  return (
    <AuthenticationContext.Provider value={{ email, hasSession }}>
      {hasSession ? (
        children
      ) : showSplashScreen ? (
        <SplashScreen />
      ) : (
        <Modal isActive={!verified}>
          {email ? (
            <AuthVerifyForm
              email={email}
              resetEmail={resetEmail}
              setVerified={setVerified}
            />
          ) : (
            <AuthEnterForm emailSent={emailSent} setEmail={setEmail} />
          )}
        </Modal>
      )}
    </AuthenticationContext.Provider>
  );
};
