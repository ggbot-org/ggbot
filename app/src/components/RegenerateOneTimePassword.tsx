import { Button, Control, Field, Message } from "@ggbot2/design";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { AuthenticationContext } from "../contexts/Authentication.js";

export const RegenerateOneTimePassword: FC = () => {
  const { resetEmail } = useContext(AuthenticationContext);

  return (
    <>
      <Message>
        <FormattedMessage id="RegenerateOneTimePassword.message" />
      </Message>

      <Field>
        <Control>
          <Button onClick={resetEmail}>
            <FormattedMessage id="RegenerateOneTimePassword.button" />
          </Button>
        </Control>
      </Field>
    </>
  );
};
