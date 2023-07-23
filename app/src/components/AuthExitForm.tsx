import {
  Button,
  Control,
  Field,
  Form,
  OutputField,
  Title,
} from "@ggbot2/design";
import { FC, useContext } from "react";

import { AuthenticationContext } from "../contexts/Authentication.js";
import { buttonLabel, fieldLabel, title } from "../i18n/index.js";
import { url } from "../routing/URLs.js";

export const AuthExitForm: FC = () => {
  const { account } = useContext(AuthenticationContext);

  const email = account?.email ?? "";

  return (
    <Form box action={url.authenticationExit}>
      <Title>{title.exitForm}</Title>

      <OutputField label={fieldLabel.email} value={email} />

      <Field isGrouped>
        <Control>
          <Button color="warning">{buttonLabel.exit}</Button>
        </Control>
      </Field>
    </Form>
  );
};
