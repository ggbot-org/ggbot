import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputField,
  InputOnChange,
  OutputField,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isAccount,
  isName,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useContext, useEffect, useState } from "react";

import { AuthenticationContext } from "../contexts/Authentication.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, errorMessage, fieldLabel, title } from "../i18n/index.js";

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const AccountSettings: FC = () => {
  const { account } = useContext(AuthenticationContext);
  const [name, setName] = useState("");
  const [help, setHelp] = useState("");

const RENAME = useApi.RenameAccount()
const isLoading = RENAME.isPending

  const readOnly = RENAME.isPending;

  let accountId = "";
  let email = "";
  let whenCreated: number | undefined;

  if (isAccount(account)) {
    accountId = account.id;
    email = account.email;
    whenCreated = account.whenCreated;
  }

  const formattedDate = useFormattedDate(whenCreated, "day");

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
    if (isAccount(account)) setName(account.name ?? "");
  }, [account]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.account}</Title>

      <OutputField label={fieldLabel.email} value={email} />

      <OutputField label={fieldLabel.whenCreated} value={formattedDate} />

      <OutputField label={fieldLabel.accountId} value={accountId} />

      <InputField
        required
        spellCheck="false"
        help={help}
        label={fieldLabel.nickName}
        name={fieldName.name}
        onChange={onChangeName}
        readOnly={readOnly}
        value={name}
      />

      <Field isGrouped>
        <Control>
          <Button isOutlined isLoading={isLoading}>
            {buttonLabel.save}
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
