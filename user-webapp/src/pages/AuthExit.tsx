import { FC } from "react";
import { AuthExitForm } from "_components/AuthExitForm";
import { AuthLayout } from "_layouts/Auth";

export const AuthExitPage: FC = () => (
  <AuthLayout>
    <AuthExitForm />
  </AuthLayout>
);
