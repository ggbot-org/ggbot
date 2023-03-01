import { Button, Control, Field, Form, FormOnSubmit, InputField } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import { route } from "_routing";
import { GenericErrorMessage, TimeoutErrorMessage } from "./ErrorMessages";

type EmailSent = ApiEnterResponseData["emailSent"];

type SetEmail = Dispatch<SetStateAction<EmailAddress | undefined>>;

type Props = {
  emailSent: EmailSent;
  setEmail: SetEmail;
};

export const AuthEnterForm: FC<Props> = ({ emailSent, setEmail }) => {
  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);

  const onSubmit = useCallback<FormOnSubmit>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isPending) return;

        setHasGenericError(false);
        setHasInvalidInput(false);
        setGotTimeout(false);

        const email = (event.target as EventTarget & { email: { value: string } }).email.value;

        const requestData = { email };

        if (!isApiEnterRequestData(requestData)) {
          setHasInvalidInput(true);
          return;
        }

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
          controller.abort();
          setGotTimeout(true);
          setIsPending(false);
        }, timeout);

        setIsPending(true);

        const response = await fetch(route.apiEnter(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        setIsPending(false);
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error();

        const responseData: ApiEnterResponseData = await response.json();

        if (responseData.emailSent) setEmail(email);
      } catch (error) {
        setHasGenericError(true);
        setIsPending(false);
        console.error(error);
      }
    },
    [emailSent, isPending, setEmail, setGotTimeout, setHasGenericError, setHasInvalidInput, setIsPending]
  );

  return (
    <Form onSubmit={onSubmit} title="Enter ggbot2">
      <InputField label="Email" name="email" type="email" readOnly={isPending} required />
      <Field isGrouped>
        <Control>
          <Button color="primary" isLoading={isPending}>
            Send
          </Button>
        </Control>
      </Field>

      <>
        {(hasGenericError || hasInvalidInput) && <GenericErrorMessage />}

        {gotTimeout && <TimeoutErrorMessage />}
      </>
    </Form>
  );
};
