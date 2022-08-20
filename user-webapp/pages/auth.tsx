import { Button, Field, Logo } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  Dispatch,
  FC,
  FormEventHandler,
  FormHTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import {
  ApiVerifyResponseData,
  isApiVerifyRequestData,
} from "_api/auth/verify";
import { Content } from "_components";
import { HasSession, readSession, route } from "_routing";

type ServerSideProps = HasSession;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = readSession(req.cookies);
  return {
    props: {
      hasSession: typeof session !== "undefined",
    },
  };
};

type AuthFormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
  message: string;
};
const AuthForm: FC<AuthFormProps> = ({ children, message, ...props }) => (
  <>
    <div className="flex flex-col items-center p-4 gap-4">
      <span className="text-2xl">{message}</span>
      <Logo size={107} animated />
    </div>
    <form className="flex flex-col w-full p-4 gap-4" {...props}>
      {children}
    </form>
  </>
);

const FeedbackMessages: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);

const GenericErrorFeedback: FC = () => <div>Something went wrong.</div>;

const InvalidInputFeedback: FC = () => <div>Something went wrong.</div>;

const TimeoutFeedback: FC = () => (
  <div>Request not sent. Please check connectivity and try again.</div>
);

type EmailSent = ApiEnterResponseData["emailSent"];

type EnterProps = {
  emailSent: EmailSent;
  setEmailSent: Dispatch<SetStateAction<EmailSent>>;
};

const Enter: FC<EnterProps> = ({ emailSent, setEmailSent }) => {
  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isLoading) return;

        setHasGenericError(false);
        setHasInvalidInput(false);
        setGotTimeout(false);

        const email = (
          event.target as EventTarget & { email: { value: string } }
        ).email.value;

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
          setIsLoading(false);
        }, timeout);

        setIsLoading(true);

        const response = await fetch(route.apiEnter(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        setIsLoading(false);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("response not ok");
        }

        const responseData: ApiEnterResponseData = await response.json();

        setEmailSent(responseData.emailSent);
      } catch (error) {
        setHasGenericError(true);
        setIsLoading(false);
        console.error(error);
      }
    },
    [
      emailSent,
      isLoading,
      setEmailSent,
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsLoading,
    ]
  );

  return (
    <>
      <AuthForm onSubmit={onSubmit} message="enter ggbot2">
        <Field
          label="email"
          name="email"
          type="email"
          readOnly={isLoading}
          required
        />
        <menu>
          <Button color="primary" isLoading={isLoading}>
            send
          </Button>
        </menu>
      </AuthForm>

      <FeedbackMessages>
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
      </FeedbackMessages>
    </>
  );
};

const Exit: FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onReset = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      router.back();
    },
    [router]
  );

  const onSubmit = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  return (
    <AuthForm
      action={route.apiExit()}
      message="exit ggbot2"
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <menu className="flex flex-row gap-4">
        <Button type="reset">stay</Button>
        <Button type="submit" color="danger" isLoading={isLoading}>
          exit
        </Button>
      </menu>
    </AuthForm>
  );
};

type VerifyProps = {
  setEmailSent: Dispatch<SetStateAction<EmailSent>>;
};

const Verify: FC<VerifyProps> = ({ setEmailSent }) => {
  const router = useRouter();

  const [codeSent, setCodeSent] = useState(false);
  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);
  const [
    needToGenerateOneTimePasswordAgain,
    setNeedToGenerateOneTimePasswordAgain,
  ] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);

  const onClickOkGenerateOneTimePasswordAgain = useCallback(() => {
    setEmailSent(false);
  }, [setEmailSent]);

  const goToHomePage = useCallback(() => {
    router.push(route.homePage());
  }, [router]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      try {
        event.preventDefault();
        if (isLoading) return;

        setHasGenericError(false);
        setHasInvalidInput(false);
        setGotTimeout(false);
        setVerificationFailed(false);

        const code = (event.target as EventTarget & { code: { value: string } })
          .code.value;

        const requestData = { code };

        if (!isApiVerifyRequestData(requestData)) {
          setHasInvalidInput(true);
          return;
        }

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
          controller.abort();
          setGotTimeout(true);
          setIsLoading(false);
        }, timeout);

        setCodeSent(true);
        setIsLoading(true);

        const response = await fetch(route.apiVerify(), {
          body: JSON.stringify(requestData),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          method: "POST",
          signal: controller.signal,
        });

        setIsLoading(false);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("response not ok");
        }

        const responseData: ApiVerifyResponseData = await response.json();

        if (responseData.verified) {
          goToHomePage();
        } else {
          setIsLoading(false);
          setVerificationFailed(true);
          if (typeof responseData.verified === "undefined") {
            setNeedToGenerateOneTimePasswordAgain(true);
          }
        }
      } catch (error) {
        setHasGenericError(true);
        setIsLoading(false);
        console.error(error);
      }
    },
    [
      goToHomePage,
      isLoading,
      setCodeSent,
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsLoading,
    ]
  );

  return (
    <>
      <AuthForm message="enter ggbot2" onSubmit={onSubmit}>
        <Field
          label="password"
          name="code"
          readOnly={isLoading}
          required
          spellCheck={false}
          type="text"
        />
        <menu>
          <Button color="primary" isLoading={isLoading}>
            enter
          </Button>
        </menu>
      </AuthForm>

      <FeedbackMessages>
        {codeSent ? null : <div>Check your email to get the password.</div>}
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
        {verificationFailed ? <div>Verification failed.</div> : null}
        {needToGenerateOneTimePasswordAgain ? (
          <div>
            <div>Need to generate one time password again</div>
            <div>
              <Button onClick={onClickOkGenerateOneTimePasswordAgain}>
                ok
              </Button>
            </div>
          </div>
        ) : null}
      </FeedbackMessages>
    </>
  );
};

const Page: NextPage<ServerSideProps> = ({ hasSession }) => {
  const [emailSent, setEmailSent] = useState<EmailSent>(false);
  return (
    <Content>
      <div className="flex flex-col items-center w-full max-w-lg p-4 gap-4">
        {hasSession ? (
          <Exit />
        ) : (
          <>
            {emailSent ? (
              <Verify setEmailSent={setEmailSent} />
            ) : (
              <Enter emailSent={emailSent} setEmailSent={setEmailSent} />
            )}
          </>
        )}
      </div>
    </Content>
  );
};

export default Page;
