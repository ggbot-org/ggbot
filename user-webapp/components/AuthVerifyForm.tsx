import { Button, ButtonOnClick, Control, Field, Form, InputField, Message } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { useRouter } from "next/router";
import { Dispatch, FC, FormEventHandler, SetStateAction, useCallback, useState } from "react";
import { ApiVerifyResponseData, isApiVerifyRequestData } from "_api/auth/verify";
import { route } from "_routing";
import { GenericErrorMessage, TimeoutErrorMessage } from "./ErrorMessages";

type SetEmail = Dispatch<SetStateAction<EmailAddress | undefined>>;

type Props = {
  setEmail: SetEmail;
  email: EmailAddress;
};

export const AuthVerifyForm: FC<Props> = ({ setEmail, email }) => {
  const router = useRouter();

  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);
  const [needToGenerateOneTimePasswordAgain, setNeedToGenerateOneTimePasswordAgain] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);

  const onClickOkGenerateOneTimePasswordAgain = useCallback<ButtonOnClick>(() => {
    setEmail(undefined);
  }, [setEmail]);

  const goToHomePage = useCallback(() => {
    router.push(route.homePage());
  }, [router]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      try {
        event.preventDefault();
        if (isPending) return;

        setHasGenericError(false);
        setHasInvalidInput(false);
        setGotTimeout(false);
        setVerificationFailed(false);

        const code = (event.target as EventTarget & { code: { value: string } }).code.value;

        const requestData = { code, email };

        if (!isApiVerifyRequestData(requestData)) {
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

        const response = await fetch(route.apiVerify(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(response.statusText);

        const responseData: ApiVerifyResponseData = await response.json();

        if (responseData.verified) {
          goToHomePage();
        } else {
          setIsPending(false);
          setVerificationFailed(true);
          if (responseData.verified === undefined) setNeedToGenerateOneTimePasswordAgain(true);
        }
      } catch (error) {
        setHasGenericError(true);
        setIsPending(false);
        console.error(error);
      }
    },
    [email, goToHomePage, isPending, setGotTimeout, setHasGenericError, setHasInvalidInput, setIsPending]
  );

  return (
    <Form onSubmit={onSubmit}>
      <InputField label="Email" defaultValue={email} readOnly />

      <Message>
        Check your email to get the <em>One Time Password</em>.
      </Message>

      <InputField
        label="One time password"
        name="code"
        readOnly={isPending}
        required
        spellCheck={false}
        type="text"
      />

      <Field isGrouped>
        <Control>
          <Button color="primary" isLoading={isPending}>
            Enter
          </Button>
        </Control>
      </Field>

      <>
        {hasGenericError || hasInvalidInput ? <GenericErrorMessage /> : null}

        {gotTimeout ? <TimeoutErrorMessage /> : null}

        {verificationFailed ? <Message color="warning">Verification failed</Message> : null}

        {needToGenerateOneTimePasswordAgain ? (
          <>
            <Message>Need to generate one time password again.</Message>

            <Field>
              <Control>
                <Button onClick={onClickOkGenerateOneTimePasswordAgain}>Ok</Button>
              </Control>
            </Field>
          </>
        ) : null}
      </>
    </Form>
  );
};
