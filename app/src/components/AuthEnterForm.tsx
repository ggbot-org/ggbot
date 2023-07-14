// TODO auth api should be an action, so it is possible to handle it with useAction by hook/useApi
// TODO Auth forms are shared among User and Admin webapp, move them to design or to a package auth-ui or authentication
// also AuthenticationContext could be shared
import {
  isApiAuthEnterRequestData,
  isApiAuthEnterResponseData,
} from "@ggbot2/api";
import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputField,
  Title,
} from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import {
  Dispatch,
  FC,
  Reducer,
  SetStateAction,
  useCallback,
  useReducer,
} from "react";
import { FormattedMessage } from "react-intl";

import { fieldLabel, title } from "../i18n/index.js";
import { url } from "../routing/URLs.js";
import { GenericErrorMessage, TimeoutErrorMessage } from "./ErrorMessages.js";

type SetEmail = Dispatch<SetStateAction<EmailAddress | undefined>>;

type Props = {
  emailSent: boolean;
  setEmail: SetEmail;
};

type State = {
  gotTimeout: boolean;
  hasGenericError: boolean;
  hasInvalidInput: boolean;
  isPending: boolean;
};

const fields = ["email"] as const;

export const AuthEnterForm: FC<Props> = ({ emailSent, setEmail }) => {
  const [
    { gotTimeout, hasGenericError, hasInvalidInput, isPending },
    dispatch,
  ] = useReducer<
    Reducer<
      Partial<State>,
      | { type: "ENTER_REQUEST" }
      | { type: "ENTER_RESPONSE" }
      | { type: "ENTER_FAILURE" }
      | { type: "ENTER_TIMEOUT" }
      | { type: "SET_HAS_INVALID_INPUT" }
    >
  >((state, action) => {
    switch (action.type) {
      case "ENTER_REQUEST":
        return { isPending: true };
      case "ENTER_RESPONSE":
        return {};
      case "ENTER_FAILURE":
        return { hasGenericError: true };
      case "ENTER_TIMEOUT":
        return { gotTimeout: true };
      case "SET_HAS_INVALID_INPUT":
        return { hasInvalidInput: true };
      default:
        return state;
    }
  }, {});

  const onSubmit = useCallback<FormOnSubmit>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isPending) return;

        const { email } = formValues(event, fields);

        if (typeof email !== "string") return;

        const requestData = { email };

        if (!isApiAuthEnterRequestData(requestData)) {
          dispatch({ type: "SET_HAS_INVALID_INPUT" });
          return;
        }

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
          controller.abort();
          dispatch({ type: "ENTER_TIMEOUT" });
        }, timeout);

        dispatch({ type: "ENTER_REQUEST" });

        const response = await fetch(url.authenticationEnter, {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw response.status;

        const responseJson = await response.json();

        dispatch({ type: "ENTER_RESPONSE" });
        if (!isApiAuthEnterResponseData(responseJson.data)) return;

        if (responseJson.data.emailSent) setEmail(email);
      } catch (error) {
        console.error(error);
        dispatch({ type: "ENTER_FAILURE" });
      }
    },
    [emailSent, isPending, setEmail]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.enterForm}</Title>

      <InputField
        required
        label={fieldLabel.email}
        name="email"
        type="email"
        readOnly={isPending}
      />

      <Field isGrouped>
        <Control>
          <Button color="primary" isLoading={isPending}>
            <FormattedMessage id="buttonLabel.send" />
          </Button>
        </Control>
      </Field>

      <>
        {hasGenericError || hasInvalidInput ? <GenericErrorMessage /> : null}
        {gotTimeout ? <TimeoutErrorMessage /> : null}
      </>
    </Form>
  );
};
