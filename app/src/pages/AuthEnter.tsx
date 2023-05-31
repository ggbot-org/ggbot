import { AuthEnterForm } from "_components/AuthEnterForm";
import { AuthVerifyForm } from "_components/AuthVerifyForm";
import { AuthLayout } from "_layouts/Auth";
import { EmailAddress } from "@ggbot2/models";
import { FC, useState } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => {
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = email !== undefined;

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

mount(Page);
