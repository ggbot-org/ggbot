import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Modal,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { Email } from "../components/Email.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { wwwHomepage } from "../routing/URLs.js";

export type AuthExitProps = {
  isActive: boolean;
  setIsActive: (arg: boolean) => void;
};

export const AuthExit: FC<AuthExitProps> = ({ isActive, setIsActive }) => {
  const { account, exit, exited } = useContext(AuthenticationContext);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      setIsActive(false);
      exit();
    },
    [exit, setIsActive]
  );

  useEffect(() => {
    if (exited) {
      window.location.href = wwwHomepage;
    }
  }, [exited]);

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <Form box onSubmit={onSubmit}>
        <Title>
          <FormattedMessage id="AuthExit.title" />
        </Title>

        <Email readOnly value={account.email} />

        <Field isGrouped>
          <Control>
            <Button color="warning">
              <FormattedMessage id="AuthExit.button" />
            </Button>
          </Control>
        </Field>
      </Form>
    </Modal>
  );
};
