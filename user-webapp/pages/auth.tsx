import { readSession } from "@ggbot2/cookies";
import { EmailAddress, isAccount } from "@ggbot2/models";
import {
  Button,
  ButtonOnClick,
  InputField,
  Logo,
  OutputField,
  Section,
} from "@ggbot2/ui-components";
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
  useMemo,
  useState,
} from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import {
  ApiVerifyResponseData,
  isApiVerifyRequestData,
} from "_api/auth/verify";
import { Content, Navigation } from "_components";
import { useApiAction } from "_hooks";
import { HasSession, route } from "_routing";

type ServerSideProps = HasSession;

type EmailSent = ApiEnterResponseData["emailSent"];

type SetEmail = Dispatch<SetStateAction<EmailAddress | undefined>>;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = readSession(req.cookies);
  return {
    props: {
      hasSession: session !== undefined,
    },
  };
};

type AuthFormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
  message: string;
};

const AuthForm: FC<AuthFormProps> = ({ children, message, ...props }) => (
  <form className="flex flex-col w-full p-4 gap-4" {...props}>
    <Section
      header={
        <div className="flex flex-row items-center py-2">
          <Logo size={171} animated />
          <span className="text-3xl">{message}</span>
        </div>
      }
    >
      {children}
    </Section>
  </form>
);

const FeedbackMessages: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);

const GenericErrorFeedback: FC = () => <div>Something went wrong.</div>;

const InvalidInputFeedback: FC = () => <div>Something went wrong.</div>;

const TimeoutFeedback: FC = () => (
  <div>Request not sent. Please check connectivity and try again.</div>
);

type EnterProps = {
  emailSent: EmailSent;
  setEmail: SetEmail;
};

const Enter: FC<EnterProps> = ({ emailSent, setEmail }) => {
  const [hasGenericError, setHasGenericError] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isPending) return;

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
    [
      emailSent,
      isPending,
      setEmail,
      setGotTimeout,
      setHasGenericError,
      setHasInvalidInput,
      setIsPending,
    ]
  );

  return (
    <>
      <AuthForm onSubmit={onSubmit} message="enter ggbot2">
        <InputField
          label="email"
          name="email"
          type="email"
          readOnly={isPending}
          required
        />
        <menu>
          <li>
            <Button color="primary" isSpinning={isPending}>
              Send
            </Button>
          </li>
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

  const [isPending, setIsPending] = useState(false);

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const { email } = useMemo(
    () =>
      isAccount(account)
        ? {
            email: account.email,
          }
        : {
            email: "",
          },
    [account]
  );

  const accountInfo = useMemo<{ label: string; value: ReactNode }[]>(
    () =>
      [
        {
          label: "email",
          value: email,
        },
      ].map(({ value, ...rest }) => ({
        value: value ? value : <>&nbsp;</>,
        ...rest,
      })),
    [email]
  );

  const onReset = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      router.back();
    },
    [router]
  );

  const onSubmit = useCallback(() => {
    setIsPending(true);
  }, [setIsPending]);

  useEffect(() => {
    const controller = readAccount({});
    return () => {
      controller.abort();
    };
  }, [readAccount]);

  return (
    <>
      <AuthForm
        action={route.apiExit()}
        message="Exit ggbot2"
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <div>
          {accountInfo.map(({ label, value }, i) => (
            <OutputField key={i} label={label}>
              {value}
            </OutputField>
          ))}
        </div>

        <menu className="flex gap-4 justify-between">
          <li>
            <Button type="reset">Stay</Button>
          </li>
          <li>
            <Button color="danger" isSpinning={isPending}>
              Exit
            </Button>
          </li>
        </menu>
      </AuthForm>
    </>
  );
};

type VerifyProps = {
  setEmail: SetEmail;
  email: EmailAddress;
};

const Verify: FC<VerifyProps> = ({ setEmail, email }) => {
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

        const code = (event.target as EventTarget & { code: { value: string } })
          .code.value;

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
          if (responseData.verified === undefined)
            setNeedToGenerateOneTimePasswordAgain(true);
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
    <>
      <AuthForm message="Enter ggbot2" onSubmit={onSubmit}>
        <OutputField label="email">{email}</OutputField>

        <div>
          Check your email to get the <em>One Time Password</em>.
        </div>

        <InputField
          label="one time password"
          name="code"
          readOnly={isPending}
          required
          spellCheck={false}
          type="text"
        />

        <menu>
          <Button color="primary" isSpinning={isPending}>
            Enter
          </Button>
        </menu>
      </AuthForm>

      <FeedbackMessages>
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
        {verificationFailed ? <div>Verification failed.</div> : null}
        {needToGenerateOneTimePasswordAgain ? (
          <div>
            <div>Need to generate one time password again</div>
            <div>
              <Button onClick={onClickOkGenerateOneTimePasswordAgain}>
                Ok
              </Button>
            </div>
          </div>
        ) : null}
      </FeedbackMessages>
    </>
  );
};

const Page: NextPage<ServerSideProps> = ({ hasSession }) => {
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = useMemo(() => email !== undefined, [email]);

  return (
    <Content topbar={<Navigation />}>
      <div className="flex flex-col items-center w-full max-w-lg p-4 gap-4">
        {hasSession ? (
          <Exit />
        ) : (
          <>
            {email ? (
              <Verify email={email} setEmail={setEmail} />
            ) : (
              <Enter emailSent={emailSent} setEmail={setEmail} />
            )}
          </>
        )}
      </div>
    </Content>
  );
};

export default Page;
