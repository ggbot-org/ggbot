import { AuthExitForm } from "_components/AuthExitForm";
import { AuthLayout } from "_layouts/Auth";
import { FC } from "react";

export const AuthExitPage: FC = () => (
  <AuthLayout>
    <AuthExitForm />
  </AuthLayout>
);
