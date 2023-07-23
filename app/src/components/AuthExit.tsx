import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Modal,
  ModalProps,
  OutputField,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useContext } from "react";
import { useIntl } from "react-intl";

import { AuthenticationContext } from "../contexts/Authentication.js";
import { buttonLabel, title } from "../i18n/index.js";

export type AuthExitProps = Required<Pick<ModalProps, 'isActive'|'setIsActive'>>

export const AuthExit: FC<AuthExitProps> = ({isActive, setIsActive}) => {
const {formatMessage} = useIntl()

  const { account, exit } = useContext(AuthenticationContext);

  const email = account?.email ?? "";

  const onSubmit = useCallback<FormOnSubmit>((event) => {
  event.preventDefault()
  setIsActive(false)
  exit()
  }, [exit, setIsActive])

  return (
  <Modal isActive={isActive} setIsActive={setIsActive}>
    <Form box onSubmit={onSubmit}>
      <Title>{title.exitForm}</Title>

      <OutputField label={formatMessage({id:"fieldLabel.email"})} value={email} />

      <Field isGrouped>
        <Control>
          <Button color="warning">{buttonLabel.exit}</Button>
        </Control>
      </Field>
    </Form>
  </Modal>
  );
};
