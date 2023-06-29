import { Modal } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { FC, PropsWithChildren, useCallback, useState } from "react";

import { AuthEnterForm } from "../components/AuthEnterForm.js";
import { AuthVerifyForm } from "../components/AuthVerifyForm.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { useAuthentication } from "../hooks/useAuthentication.js";

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const authentication = useAuthentication();
  const { hasSession } = authentication;

  const [email, setEmail] = useState<EmailAddress | undefined>();
  const [verified, setVerified] = useState(false);

  const resetEmail = useCallback(() => {
    setEmail(undefined);
  }, [setEmail]);

  const emailSent = email !== undefined;

  return (
    <AuthenticationContext.Provider value={authentication}>
      {/* TODO remove or improve loader*/}
      {hasSession === undefined ? <>Loading...</> : null}
      {hasSession ? children : null}

      {hasSession === false ? (
        <Modal isActive={!verified}>
          {email ? (
            <AuthVerifyForm
              email={email}
              resetEmail={resetEmail}
              setVerified={setVerified}
            />
          ) : (
            <AuthEnterForm emailSent={emailSent} setEmail={setEmail} />
          )}
        </Modal>
      ) : null}
    </AuthenticationContext.Provider>
  );
};
