import { Modal } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";

import { AuthEnterForm } from "../components/AuthEnterForm.js";
import { AuthVerifyForm } from "../components/AuthVerifyForm.js";
import { SplashScreen } from "../components/SplashScreen.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { useAuthentication } from "../hooks/useAuthentication.js";

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const authentication = useAuthentication();
  const { hasSession } = authentication;

  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [email, setEmail] = useState<EmailAddress | undefined>();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!showSplashScreen) return;
    if (hasSession !== undefined) {
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 1700);
    }
  }, [hasSession, showSplashScreen]);

  const resetEmail = useCallback(() => {
    setEmail(undefined);
  }, [setEmail]);

  const emailSent = email !== undefined;

  return (
    <AuthenticationContext.Provider value={authentication}>
      {hasSession ? (
        children
      ) : showSplashScreen ? (
        <SplashScreen />
      ) : (
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
      )}
    </AuthenticationContext.Provider>
  );
};
