import { EmailAddress } from "@ggbot2/models";
import { FC, useMemo, useState } from "react";
import { AuthEnterForm } from "_components/AuthEnterForm";
import { AuthVerifyForm } from "_components/AuthVerifyForm";
import { AuthLayout } from "_layouts/Auth";

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
