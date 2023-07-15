import { Modal } from "@ggbot2/design";
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
  useReducer,
} from "react";

import {
  AuthEnterForm,
  AuthEnterFormProps,
} from "../components/AuthEnterForm.js";
import {
  AuthVerifyForm,
  AuthVerifyFormProps,
} from "../components/AuthVerifyForm.js";
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

type ContextValue = Pick<State, "email"> & {
  exit: () => void;
};

export const AuthenticationContext = createContext<ContextValue>({
  email: undefined,
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

  const [READ, { data: readAccountData }] = useApi.ReadAccount();

  const setJwt = useCallback<AuthVerifyFormProps["setJwt"]>(
    (jwt) => {
      dispatch({ type: "SET_JWT", data: { jwt } });
    },
    [dispatch]
  );

  const unsetEmail = useCallback<AuthVerifyFormProps["unsetEmail"]>(() => {
    dispatch({ type: "SET_EMAIL", data: { email: undefined } });
  }, [dispatch]);

  const setEmail = useCallback<AuthEnterFormProps["setEmail"]>((email) => {
    dispatch({ type: "SET_EMAIL", data: { email } });
  }, []);

  const exit = useCallback(() => {
    dispatch({ type: "EXIT" });
  }, []);

  useEffect(() => {
    if (jwt) READ({});
  }, [READ, jwt]);

  useEffect(() => {
    if (jwt !== undefined) return;
    setTimeout(() => {
      dispatch({ type: "HIDE_SPLASH_SCREEN" });
    }, splashScreenDuration);
  }, [jwt]);

  useEffect(() => {
    if (readAccountData === undefined) return;

    if (readAccountData === null) {
      dispatch({ type: "SET_EMAIL", data: { email: undefined } });
    }

    if (isAccount(readAccountData)) {
      dispatch({ type: "SET_EMAIL", data: { email: readAccountData.email } });

      if (!showSplashScreen) return;
      setTimeout(() => {
        dispatch({ type: "HIDE_SPLASH_SCREEN" });
      }, splashScreenDuration - (now() - startSession));
    }
  }, [readAccountData, startSession, showSplashScreen]);

  if (showSplashScreen) return <SplashScreen />;

  if (jwt === undefined) {
    return (
      <Modal isActive>
        {email ? (
          <AuthVerifyForm
            email={email}
            unsetEmail={unsetEmail}
            setJwt={setJwt}
          />
        ) : (
          <AuthEnterForm setEmail={setEmail} />
        )}
      </Modal>
    );
  }

  return (
    <AuthenticationContext.Provider value={{ email, exit }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
