import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputOnChange,
  Title,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isName,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccountId } from "../components/AccountId.js";
import { AccountNickName } from "../components/AccountNickName.js";
import { Email } from "../components/Email.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { AccountContext } from "../contexts/Account.js";
import { useApi } from "../hooks/useApi.js";
import { errorMessage } from "../i18n/index.js";

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const AccountSettings: FC = () => {
  const { account } = useContext(AccountContext);
  const [name, setName] = useState(account.name ?? "");
  const [help, setHelp] = useState("");

  const RENAME = useApi.RenameAccount();
  const isLoading = RENAME.isPending;

  const readOnly = RENAME.isPending;

  const onChangeName = useCallback<InputOnChange>((event) => {
    const value = event.target.value;
    if (!isName(value)) return;
    setName(value);
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!RENAME.canRun) return;
      try {
        const { name } = formValues(event, fields);
        if (!isName(name)) return;
        const newName = normalizeName(name);
        throwIfInvalidName(newName);
        RENAME.request({ name: newName });
        setName(newName);
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidAccountName);
      }
    },
    [RENAME]
  );

  // Set name on READ.
  useEffect(() => {
    if (account) setName(account.name ?? "");
  }, [account]);

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
        help={help}
        name={fieldName.name}
        onChange={onChangeName}
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
