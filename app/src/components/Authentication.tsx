import { Modal } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { FC, PropsWithChildren, useState } from "react";

import { AuthEnterForm } from "../components/AuthEnterForm.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { useAuthentication } from "../hooks/useAuthentication.js";

// TODO create AuthenticationEnterModal

export const Authentication: FC<PropsWithChildren> = ({ children }) => {
  const authentication = useAuthentication();
  const { hasSession } = authentication;

  const [enterModalIsActive, setEnterModalIsActive] = useState(true);
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = email !== undefined;

  return (
    <AuthenticationContext.Provider value={authentication}>
      {/* remove or improve loader*/}
      {hasSession === undefined ? <>Loading...</> : null}
      {hasSession ? children : null}

      {hasSession === false ? (
        <Modal
          isActive={enterModalIsActive}
          setIsActive={setEnterModalIsActive}
        >
          <AuthEnterForm emailSent={emailSent} setEmail={setEmail} />
        </Modal>
      ) : null}
    </AuthenticationContext.Provider>
  );
};
