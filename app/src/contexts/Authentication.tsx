import { BadGatewayError } from "@ggbot2/http";
import { Account, EmailAddress, isAccount, noneAccount } from "@ggbot2/models";
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
import { AuthExit, AuthExitProps } from "../components/AuthExit.js";
import { AuthVerify, AuthVerifyProps } from "../components/AuthVerify.js";
import {
  SplashScreen,
  splashScreenDuration,
} from "../components/SplashScreen.js";
import { useApi } from "../hooks/useApi.js";

type State = {
  email: EmailAddress | undefined;
  exitIsActive: boolean;
  jwt: NonEmptyString | undefined;
  showSplashScreen: boolean;
  verified?: boolean | undefined;
  startSession: Time;
  exited: boolean;
};

type ContextValue = Pick<State, "exited"> & {
  account: Account;
  openExitModal: () => void;
  exit: () => void;
  resetEmail: () => void;
};

export const AuthenticationContext = createContext<ContextValue>({
  account: noneAccount,
  openExitModal: () => {},
  exit: () => {},
  exited: false,
  resetEmail: () => {},
});

AuthenticationContext.displayName = "AuthenticationContext";

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const isFirstPageView = !sessionWebStorage.gotFirstPageView;

  const [
    { email, exited, exitIsActive, showSplashScreen, jwt, startSession },
    dispatch,
  ] = useReducer<
    Reducer<
      State,
      | { type: "HIDE_SPLASH_SCREEN" }
      | { type: "EXIT" }
      | { type: "SET_EMAIL"; data: Pick<State, "email"> }
      | { type: "SET_EXIT_IS_ACTIVE"; data: Pick<State, "exitIsActive"> }
      | { type: "SET_JWT"; data: Pick<State, "jwt"> }
    >
  >(
    (state, action) => {
      switch (action.type) {
        case "EXIT": {
          sessionWebStorage.clear();
          localWebStorage.clear();
          return { ...state, exited: true };
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

        case "SET_EXIT_IS_ACTIVE": {
          const { exitIsActive } = action.data;
          return { ...state, exitIsActive };
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
      exitIsActive: false,
      jwt: localWebStorage.jwt,
      showSplashScreen: isFirstPageView,
      startSession: now(),
      exited: false,
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

  const setEmail = useCallback<AuthEnterProps["setEmail"]>((email) => {
    dispatch({ type: "SET_EMAIL", data: { email } });
  }, []);

  const setExitIsActive = useCallback<AuthExitProps["setIsActive"]>(
    (exitIsActive) => {
      dispatch({ type: "SET_EXIT_IS_ACTIVE", data: { exitIsActive } });
    },
    []
  );

  const contextValue = useMemo<ContextValue>(
    () => ({
      account: isAccount(account) ? account : noneAccount,
      exit: () => {
        dispatch({ type: "EXIT" });
      },
      exited,
      openExitModal: () => {
        dispatch({ type: "SET_EXIT_IS_ACTIVE", data: { exitIsActive: true } });
      },
      resetEmail: () => {
        dispatch({ type: "SET_EMAIL", data: { email: undefined } });
      },
    }),
    [account, exited]
  );

  // Fetch account.
  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  // Handle errors.
  useEffect(() => {
    if (READ.error) {
      if (READ.error.name === BadGatewayError.name) {
        // Re-fetch.
        const timeoutId = window.setTimeout(() => {
          READ.reset();
        }, 5000);
        return () => {
          window.clearTimeout(timeoutId);
        };
      }
    }
  }, [READ]);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "HIDE_SPLASH_SCREEN" });
    }, splashScreenDuration);
  }, []);

  useEffect(() => {
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
    if (email) {
      return <AuthVerify email={email} setJwt={setJwt} />;
    } else {
      return <AuthEnter setEmail={setEmail} />;
    }
  }

  if (!isAccount(account)) return null;

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}

      <AuthExit isActive={exitIsActive} setIsActive={setExitIsActive} />
    </AuthenticationContext.Provider>
  );
};
