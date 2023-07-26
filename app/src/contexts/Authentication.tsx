import { EmailAddress, isAccount } from "@ggbot2/models";
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
import { AccountProvider } from "../contexts/Account.js";
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

type ContextValue = Pick<State, "email" | "exited"> & {
  openExitModal: () => void;
  exit: () => void;
};

export const AuthenticationContext = createContext<ContextValue>({
  email: undefined,
  openExitModal: () => {},
  exit: () => {},
  exited: false,
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
          sessionWebStorage.email = undefined;
          localWebStorage.jwt = undefined;
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

  const unsetEmail = useCallback<AuthVerifyProps["unsetEmail"]>(() => {
    dispatch({ type: "SET_EMAIL", data: { email: undefined } });
  }, [dispatch]);

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
      email,
      exit: () => {
        dispatch({ type: "EXIT" });
      },
      exited,
      openExitModal: () => {
        dispatch({ type: "SET_EXIT_IS_ACTIVE", data: { exitIsActive: true } });
      },
    }),
    [email, exited]
  );

  useEffect(() => {
    if (READ.canRun) READ.request();
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
      return (
        <AuthVerify email={email} unsetEmail={unsetEmail} setJwt={setJwt} />
      );
    } else {
      return <AuthEnter setEmail={setEmail} />;
    }
  }

  if (isAccount(account))
    return (
      <AuthenticationContext.Provider value={contextValue}>
        <AccountProvider account={account}>{children}</AccountProvider>

        <AuthExit isActive={exitIsActive} setIsActive={setExitIsActive} />
      </AuthenticationContext.Provider>
    );

  return null;
};
