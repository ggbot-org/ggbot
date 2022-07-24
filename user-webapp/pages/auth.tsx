import { Button, Field, Logo } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import {
  Dispatch,
  FC,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { ApiEnterResponseData, isApiEnterRequestData } from "_api/auth/enter";
import { Page } from "_components";
import { HasSession, hasValidSessionCookie, route } from "_routing";

type ServerSideProps = HasSession;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasSession = hasValidSessionCookie(req.cookies);

  return {
    props: {
      hasSession,
    },
  };
};

type EmailSent = ApiEnterResponseData["emailSent"];

type EnterProps = {
  emailSent: EmailSent;
  setEmailSent: Dispatch<SetStateAction<EmailSent>>;
};

const Enter: FC<EnterProps> = ({ emailSent, setEmailSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gotTimeout, setGotTimeout] = useState(false);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      try {
        event.preventDefault();
        if (emailSent || isLoading) return;

        setGotTimeout(false);

        const email = (
          event.target as EventTarget & { email: { value: string } }
        ).email.value;

        const requestData = { email };

        if (!isApiEnterRequestData(requestData)) {
          // TODO feedback error
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

        if (response.ok) {
          const responseData: ApiEnterResponseData = await response.json();

          setEmailSent(responseData.emailSent);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    },
    [emailSent, isLoading, setIsLoading]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <span className="text-2xl">enter ggbot2</span>
          <Logo size={107} animated />
        </div>
        <Field label="email" name="email" type="email" />
        <menu>
          <Button color="primary" isLoading={isLoading}>
            send
          </Button>
        </menu>
      </form>

      <div className="my-4">
        {gotTimeout ? (
          <div>Request not sent. Please check connectivity and try again.</div>
        ) : null}
      </div>
    </div>
  );
};

const Exit: FC = () => {
  return <div>exit</div>;
};

const Verify: FC = () => {
  return <div>verify</div>;
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
