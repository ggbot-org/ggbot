import { Modal } from "@ggbot2/design";
import { Account, EmailAddress, isAccount } from "@ggbot2/models";
import { now, Time } from "@ggbot2/time";
import { NonEmptyString } from "@ggbot2/type-utils";
import { localWebStorage, sessionWebStorage } from "@ggbot2/web-storage";
import {
  createContext,
  FC,
  PropsWithChildren,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { AuthEnter, AuthEnterProps } from "../components/AuthEnter.js";
import { AuthVerify, AuthVerifyProps } from "../components/AuthVerify.js";
import {
  SplashScreen,
  splashScreenDuration,
} from "../components/SplashScreen.js";
import { useApi } from "../hooks/useApi.js";

type State = {
  email: EmailAddress | undefined;
  jwt: NonEmptyString | undefined;
  showSplashScreen: boolean;
  verified?: boolean | undefined;
  startSession: Time;
};

type ContextValue = {
  account?: Account | null | undefined;
  exit: () => void;
};

export const AuthenticationContext = createContext<ContextValue>({
  exit: () => {},
});

AuthenticationContext.displayName = "AuthenticationContext";

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const isFirstPageView = !sessionWebStorage.gotFirstPageView;

  const [{ email, showSplashScreen, jwt, startSession }, dispatch] = useReducer<
    Reducer<
      State,
      | { type: "HIDE_SPLASH_SCREEN" }
      | { type: "EXIT" }
      | { type: "SET_EMAIL"; data: Pick<State, "email"> }
      | { type: "SET_JWT"; data: Pick<State, "jwt"> }
    >
  >(
    (state, action) => {
      switch (action.type) {
        case "EXIT": {
          sessionWebStorage.email = undefined;
          localWebStorage.jwt = undefined;
          return { ...state, email: undefined, jwt: undefined };
        }

        case "HIDE_SPLASH_SCREEN": {
          sessionWebStorage.gotFirstPageView = true;
          return { ...state, showSplashScreen: false };
        }

        case "SET_EMAIL": {
          const { email } = action.data;
          sessionWebStorage.email = email;
          return { ...state, email };
        }

        case "SET_JWT": {
          const { jwt } = action.data;
          localWebStorage.jwt = jwt;
          return { ...state, jwt };
        }

        default:
          return state;
      }
    },
    {
      email: sessionWebStorage.email,
      jwt: localWebStorage.jwt,
      showSplashScreen: isFirstPageView,
      startSession: now(),
    }
  );

  const READ = useApi.ReadAccount();
  const account = READ.data;

  const setJwt = useCallback<AuthVerifyProps["setJwt"]>(
    (jwt) => {
      dispatch({ type: "SET_JWT", data: { jwt } });
    },
    [dispatch]
  );

  const unsetEmail = useCallback<AuthVerifyProps["unsetEmail"]>(() => {
    dispatch({ type: "SET_EMAIL", data: { email: undefined } });
  }, [dispatch]);

  const setEmail = useCallback<AuthEnterProps["setEmail"]>((email) => {
    dispatch({ type: "SET_EMAIL", data: { email } });
  }, []);

  const exit = useCallback(() => {
    dispatch({ type: "EXIT" });
  }, []);

  const contextValue = useMemo<ContextValue>(() => {
    if (account === null || isAccount(account)) return { account, exit };
    return { exit };
  }, [account, exit]);

  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "HIDE_SPLASH_SCREEN" });
    }, splashScreenDuration);
  }, []);

  useEffect(() => {
    if (account === undefined) return;

    if (account === null) {
      dispatch({ type: "SET_EMAIL", data: { email: undefined } });
    }

    if (isAccount(account)) {
      dispatch({ type: "SET_EMAIL", data: { email: account.email } });

      if (!showSplashScreen) return;
      setTimeout(() => {
        dispatch({ type: "HIDE_SPLASH_SCREEN" });
      }, splashScreenDuration - (now() - startSession));
    }
  }, [account, startSession, showSplashScreen]);

  if (showSplashScreen) return <SplashScreen />;

  if (jwt === undefined) {
    return (
      <Modal isActive>
        {email ? (
          <AuthVerify email={email} unsetEmail={unsetEmail} setJwt={setJwt} />
        ) : (
          <AuthEnter setEmail={setEmail} />
        )}
      </Modal>
    );
  }

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};
