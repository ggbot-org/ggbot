import {
  isApiAuthVerifyResponseData,
  isApiAuthVerifyRequestData,
} from "@ggbot2/api";
import {
  Button,
  ButtonOnClick,
  Control,
  Field,
  Form,
  InputField,
  Message,
  OutputField,
} from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { useRouter } from "next/router";
import {
  Dispatch,
  FC,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  GenericErrorMessage,
  TimeoutErrorMessage,
} from "_components/ErrorMessages";
import { buttonLabel, fieldLabel } from "_i18n";
import { pathname } from "_routing/pathnames";

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
  const [
    needToGenerateOneTimePasswordAgain,
    setNeedToGenerateOneTimePasswordAgain,
  ] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);

  const onClickOkGenerateOneTimePasswordAgain =
    useCallback<ButtonOnClick>(() => {
      setEmail(undefined);
    }, [setEmail]);

  const goToHomePage = useCallback(() => {
    router.push(pathname.homePage());
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

        const code = (event.target as EventTarget & { code: { value: string } })
          .code.value;

        const requestData = { code, email };

        if (!isApiAuthVerifyRequestData(requestData)) {
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

        const response = await fetch(pathname.apiVerify(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(response.statusText);

        const responseData = await response.json();

        setIsPending(false);

        if (responseData === null) {
          setNeedToGenerateOneTimePasswordAgain(true);
        } else if (isApiAuthVerifyResponseData(responseData)) {
          const { verified } = responseData;
          if (verified) {
            setVerificationFailed(false);
            goToHomePage();
          } else {
            setVerificationFailed(true);
          }
        }
      } catch (error) {
        setHasGenericError(true);
        setIsPending(false);
        console.error(error);
      }
    },
    [
      email,
      goToHomePage,
      isPending,
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsPending,
    ]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <OutputField label={fieldLabel.email} value={email} />

      <Message>
        Check your email to get the <em>One Time Password</em>.
      </Message>

      <InputField
        required
        label={fieldLabel.oneTimePassword}
        name="code"
        readOnly={isPending}
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

        {verificationFailed ? (
          <Message color="warning">Verification failed</Message>
        ) : null}

        {needToGenerateOneTimePasswordAgain ? (
          <>
            <Message>Need to generate one time password again.</Message>

            <Field>
              <Control>
                <Button onClick={onClickOkGenerateOneTimePasswordAgain}>
                  {buttonLabel.ok}
                </Button>
              </Control>
            </Field>
          </>
        ) : null}
      </>
    </Form>
  );
};
