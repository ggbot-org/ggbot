import { EmailAddress } from "@ggbot2/models";
import { FC, useMemo, useState } from "react";
import { AuthEnterForm, AuthVerifyForm } from "_components";
import { AuthLayout } from "_layouts";

export const AuthEnterPage: FC = () => {
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = useMemo(() => email !== undefined, [email]);

  return (
    <AuthLayout>
      {email ? (
        <AuthVerifyForm email={email} setEmail={setEmail} />
      ) : (
        <AuthEnterForm emailSent={emailSent} setEmail={setEmail} />
      )}
    </AuthLayout>
  );
};
