import {
  isApiAuthVerifyRequestData,
  isApiAuthVerifyResponseData,
} from "@ggbot2/api";
import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Message,
  Modal,
} from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { NonEmptyString } from "@ggbot2/type-utils";
import { FC, Reducer, useCallback, useContext, useReducer } from "react";
import { FormattedMessage } from "react-intl";

import { Email } from "../components/Email.js";
import { GenericError } from "../components/GenericError.js";
import { OneTimePassword } from "../components/OneTimePassword.js";
import { RegenerateOneTimePassword } from "../components/RegenerateOneTimePassword.js";
import { TimeoutError } from "../components/TimeoutError.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { url } from "../routing/URLs.js";

export type AuthVerifyProps = {
  email: EmailAddress;
  setJwt: (jwt: NonEmptyString) => void;
};

type State = {
  gotTimeout: boolean;
  hasGenericError: boolean;
  hasInvalidInput: boolean;
  isPending: boolean;
  needToGenerateOneTimePasswordAgain: boolean;
  verificationFailed: boolean;
};

export const AuthVerify: FC<AuthVerifyProps> = ({ email, setJwt }) => {
  const { resetEmail } = useContext(AuthenticationContext);

  const [
    {
      gotTimeout,
      hasGenericError,
      hasInvalidInput,
      isPending,
      needToGenerateOneTimePasswordAgain,
      verificationFailed,
    },
    dispatch,
  ] = useReducer<
    Reducer<
      Partial<State>,
      | { type: "SET_HAS_INVALID_INPUT" }
      | { type: "VERIFY_REQUEST" }
      | {
          type: "VERIFY_RESPONSE";
          data: Partial<
            Pick<
              State,
              "needToGenerateOneTimePasswordAgain" | "verificationFailed"
            >
          >;
        }
      | { type: "VERIFY_FAILURE" }
      | { type: "VERIFY_TIMEOUT" }
    >
  >(
    (state, action) => {
      switch (action.type) {
        case "SET_HAS_INVALID_INPUT":
          return { hasInvalidInput: true };

        case "VERIFY_REQUEST":
          return { isPending: true };

        case "VERIFY_RESPONSE":
          return { hasGenericError: true, ...action.data };

        case "VERIFY_FAILURE":
          return { hasGenericError: true };

        case "VERIFY_TIMEOUT":
          return { gotTimeout: true };

        default:
          return state;
      }
    },
    { hasGenericError: false }
  );

  const onSubmit = useCallback<FormOnSubmit>(
    async (event) => {
      try {
        event.preventDefault();
        if (isPending) return;

        const code = (event.target as EventTarget & { code: { value: string } })
          .code.value;

        const requestData = { code, email };

        if (!isApiAuthVerifyRequestData(requestData)) {
          dispatch({ type: "SET_HAS_INVALID_INPUT" });
          return;
        }

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
          controller.abort();
          dispatch({ type: "VERIFY_TIMEOUT" });
        }, timeout);

        dispatch({ type: "VERIFY_REQUEST" });

        const response = await fetch(url.authenticationVerify, {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        if (data === null) {
          dispatch({
            type: "VERIFY_RESPONSE",
            data: { needToGenerateOneTimePasswordAgain: true },
          });
        } else if (isApiAuthVerifyResponseData(data)) {
          const { jwt } = data;
          if (jwt) {
            setJwt(jwt);
          } else {
            dispatch({
              type: "VERIFY_RESPONSE",
              data: { verificationFailed: true },
            });
          }
        }
      } catch (error) {
        dispatch({ type: "VERIFY_FAILURE" });
        console.error(error);
      }
    },
    [dispatch, email, isPending, setJwt]
  );

  return (
    <Modal isActive>
      <Form box onSubmit={onSubmit}>
        <Email readOnly value={email} />

        <Field>
          <Control>
            <Button size="small" onClick={resetEmail}>
              <FormattedMessage id="AuthVerify.resetEmail" />
            </Button>
          </Control>
        </Field>

        <Message>
          <FormattedMessage
            id="AuthVerify.checkEmail"
            values={{ em: (chunks) => <em>{chunks}</em> }}
          />
        </Message>

        <OneTimePassword required name="code" readOnly={isPending} />

        <Field>
          <Control>
            <Button color="primary" isLoading={isPending}>
              <FormattedMessage id="AuthVerify.button" />
            </Button>
          </Control>
        </Field>

        <>
          {hasGenericError || (hasInvalidInput && <GenericError />)}

          {gotTimeout ? <TimeoutError /> : null}

          {verificationFailed ? (
            <Message color="warning">
              <FormattedMessage id="AuthVerify.failed" />
            </Message>
          ) : null}

          {needToGenerateOneTimePasswordAgain ? (
            <RegenerateOneTimePassword />
          ) : null}
        </>
      </Form>
    </Modal>
  );
};
