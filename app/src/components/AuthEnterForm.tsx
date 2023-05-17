import {
  GenericErrorMessage,
  TimeoutErrorMessage,
} from "_components/ErrorMessages";
import { buttonLabel, fieldLabel, title } from "_i18n";
import { pathname } from "_routing/pathnames";
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
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";

type SetEmail = Dispatch<SetStateAction<EmailAddress | undefined>>;

type Props = {
  emailSent: boolean;
  setEmail: SetEmail;
};

const fields = ["email"] as const;

export const AuthEnterForm: FC<Props> = ({ emailSent, setEmail }) => {
  const [
    { gotTimeout, hasGenericError, hasInvalidInput, isPending },
    setState,
  ] = useState({
    gotTimeout: false,
    hasGenericError: false,
    hasInvalidInput: false,
    isPending: false,
  });

  const onSubmit = useCallback<FormOnSubmit>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isPending) return;

        setState((state) => ({
          ...state,
          gotTimeout: false,
          hasGenericError: false,
          hasInvalidInput: false,
        }));

        const { email } = formValues(event, fields);

        if (typeof email !== "string") return;

        const requestData = { email };

        if (!isApiAuthEnterRequestData(requestData)) {
          setState((state) => ({ ...state, hasInvalidInput: true }));
          return;
        }

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
          controller.abort();
          setState((state) => ({
            ...state,
            gotTimeout: true,
            isPending: false,
          }));
        }, timeout);

        setState((state) => ({ ...state, isPending: true }));

        const response = await fetch(pathname.apiEnter(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        setState((state) => ({ ...state, isPending: false }));
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error();

        const responseData = await response.json();
        if (!isApiAuthEnterResponseData(requestData)) return;

        if (responseData.emailSent) setEmail(email);
      } catch (error) {
        setState((state) => ({
          ...state,
          hasGenericError: true,
          isPending: false,
        }));
        console.error(error);
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
            {buttonLabel.send}
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
