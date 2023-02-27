import { readSession } from "@ggbot2/cookies";
import {
  Button,
  ButtonOnClick,
  Column,
  Columns,
  Container,
  Control,
  Field,
  Form,
  FormOnReset,
  FormOnSubmit,
  InputField,
  Logo,
  Navbar,
  NavbarBrand,
  NavbarItem,
  OutputField,
  Section,
  classNames,
} from "@ggbot2/design";
import { EmailAddress, isAccount } from "@ggbot2/models";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  Dispatch,
  FC,
  FormEventHandler,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import { ApiVerifyResponseData, isApiVerifyRequestData } from "_api/auth/verify";
import { Page } from "_components";
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

const GenericErrorFeedback: FC = () => <div>Something went wrong.</div>;

const InvalidInputFeedback: FC = () => <div>Something went wrong.</div>;

const TimeoutFeedback: FC = () => <div>Request not sent. Please check connectivity and try again.</div>;

type EnterProps = {
  emailSent: EmailSent;
  setEmail: SetEmail;
};

const Enter: FC<EnterProps> = ({ emailSent, setEmail }) => {
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
    <Form onSubmit={onSubmit}>
      <InputField label="Email" name="email" type="email" readOnly={isPending} required />
      <Field isGrouped>
        <Control>
          <Button color="primary" isLoading={isPending}>
            Send
          </Button>
        </Control>
      </Field>

      <>
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
      </>
    </Form>
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
          label: "Email",
          value: email,
        },
      ].map(({ value, ...rest }) => ({
        value: value ? value : <>&nbsp;</>,
        ...rest,
      })),
    [email]
  );

  const onReset = useCallback<FormOnReset>(
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
    <Form action={route.apiExit()} onReset={onReset} onSubmit={onSubmit}>
      {accountInfo.map(({ label, value }, i) => (
        <OutputField key={i} label={label}>
          {value}
        </OutputField>
      ))}

      <Field isGrouped>
        <Control>
          <Button type="reset">Stay</Button>
        </Control>

        <Control>
          <Button color="danger" isLoading={isPending}>
            Exit
          </Button>
        </Control>
      </Field>
    </Form>
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
      <OutputField label="Email">{email}</OutputField>

      <div>
        Check your email to get the <em>One Time Password</em>.
      </div>

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
        {hasGenericError ? <GenericErrorFeedback /> : null}
        {hasInvalidInput ? <InvalidInputFeedback /> : null}
        {gotTimeout ? <TimeoutFeedback /> : null}
        {verificationFailed ? <div>Verification failed.</div> : null}
        {needToGenerateOneTimePasswordAgain ? (
          <div>
            <div>Need to generate one time password again</div>
            <div>
              <Button onClick={onClickOkGenerateOneTimePasswordAgain}>Ok</Button>
            </div>
          </div>
        ) : null}
      </>
    </Form>
  );
};

const AuthPage: NextPage<ServerSideProps> = ({ hasSession }) => {
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = useMemo(() => email !== undefined, [email]);

  const title = useMemo(() => (hasSession ? "Exit ggbot2" : "Enter ggbot2"), [hasSession]);

  return (
    <Page
      topbar={
        <Navbar color="black">
          <NavbarBrand>
            <NavbarItem className={classNames("is-unselectable")}>
              <Logo size={24} />
              <span>
                ggbot<b className={classNames("has-text-brand")}>2</b>
              </span>
            </NavbarItem>
          </NavbarBrand>
        </Navbar>
      }
    >
      <Container maxWidth="desktop">
        <Section>
          <Columns isCentered>
            <Column offset="half">
              <h1 className={classNames("title")}>{title}</h1>
            </Column>
          </Columns>

          <Columns isCentered>
            <Column isNarrow>
              <Logo size={171} animated />
            </Column>
            <Column size="half">
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
            </Column>
          </Columns>
        </Section>
      </Container>
    </Page>
  );
};

export default AuthPage;
