// Port this page to a modal
import { EmailAddress } from "@ggbot2/models";
import { mount } from "@ggbot2/react";
import { FC, useState } from "react";

import { AuthEnterForm } from "../components/AuthEnterForm.js";
import { AuthVerifyForm } from "../components/AuthVerifyForm.js";
import { AuthLayout } from "../layouts/Auth.js";

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
