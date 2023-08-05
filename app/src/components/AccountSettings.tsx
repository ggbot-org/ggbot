import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Title,
} from "@ggbot2/design";
import { isName } from "@ggbot2/models";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccountId } from "../components/AccountId.js";
import { AccountNickName } from "../components/AccountNickName.js";
import { Email } from "../components/Email.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { AuthenticationContext } from "../contexts/Authentication.js";
import { useApi } from "../hooks/useApi.js";

const fieldName = {
  name: "name",
};
const fields = Object.keys(fieldName);

export const AccountSettings: FC = () => {
  const { account } = useContext(AuthenticationContext);
  const [name, setName] = useState(account.name ?? "");

  const RENAME = useApi.RenameAccount();
  const isLoading = RENAME.isPending;

  const readOnly = RENAME.isPending;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!RENAME.canRun) return;
      const { name } = formValues(event, fields);
      if (!isName(name)) return;
      RENAME.request({ name });
    },
    [RENAME]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="AccountSettings.title" />
      </Title>

      <Email readOnly value={account.email} />

      <WhenCreated value={account.whenCreated} />

      <AccountId value={account.id} />

      <AccountNickName
        required
        name={fieldName.name}
        setValue={setName}
        readOnly={readOnly}
        value={name}
      />

      <Field isGrouped>
        <Control>
          <Button isOutlined isLoading={isLoading}>
            <FormattedMessage id="AccountSettings.button" />
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
