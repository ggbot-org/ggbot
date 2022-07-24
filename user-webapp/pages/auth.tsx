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
  useEffect,
  useState,
} from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import {
  ApiVerifyResponseData,
  isApiVerifyRequestData,
} from "_api/auth/verify";
import { Page } from "_components";
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
  <form className="p-4 flex flex-col gap-4 sm:w-96" {...props}>
    <div className="flex flex-col items-center gap-4">
      <span className="text-2xl">{message}</span>
      <Logo size={107} animated />
    </div>
    {children}
  </form>
);

const FeedbackMessages: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="my-4">{children}</div>
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
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsLoading,
    ]
  );

  return (
    <div>
      <AuthForm onSubmit={onSubmit} message="enter ggbot2">
        <Field label="email" name="email" type="email" />
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
    </div>
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
  }, [router, setIsLoading]);

  return (
    <div>
      <AuthForm
        action={route.apiExit()}
        message="exit ggbot2"
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <menu>
          <Button type="reset">stay</Button>
          <Button type="submit" color="danger" isLoading={isLoading}>
            exit
          </Button>
        </menu>
      </AuthForm>
    </div>
  );
};

const Verify: FC = () => {
  const router = useRouter();

  const [codeSent, setCodeSent] = useState(false);
  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);

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
        }
      } catch (error) {
        setHasGenericError(true);
        setIsLoading(false);
        console.error(error);
      }
    },
    [
      isLoading,
      setCodeSent,
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsLoading,
      setGotTimeout,
    ]
  );

  useEffect(() => {}, [router]);

  return (
    <div>
      <AuthForm message="enter ggbot2" onSubmit={onSubmit}>
        <Field
          className="w-32 text-center"
          label="password"
          name="code"
          type="text"
          spellCheck={false}
          required
        />
        <menu>
          <Button color="primary" isLoading={isLoading}>
            enter
          </Button>
        </menu>
      </AuthForm>

      {codeSent ? null : <div>Check your email to get the password.</div>}

      <FeedbackMessages>
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
        {verificationFailed ? <div>Verification failed.</div> : null}
      </FeedbackMessages>
    </div>
  );
};

const AuthPage: NextPage<ServerSideProps> = ({ hasSession }) => {
  const [emailSent, setEmailSent] = useState<EmailSent>(false);

  return (
    <Page>
      {hasSession ? (
        <Exit />
      ) : (
        <>
          {emailSent ? (
            <Verify />
          ) : (
            <Enter emailSent={emailSent} setEmailSent={setEmailSent} />
          )}
        </>
      )}
    </Page>
  );
};

export default AuthPage;
