import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  InputOnChange,
  OutputField,
  Title,
  formValues,
  useFormattedDate,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isAccount,
  isName,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";
import { useApi } from "_hooks/useApi";
import { buttonLabel, fieldLabel, errorMessage, title } from "_i18n";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const AccountSettings: FC = () => {
  const [name, setName] = useState("");
  const [help, setHelp] = useState("");

  const [READ, { data: account, isPending: readIsPending }] =
    useApi.ReadAccount();

  const [RENAME, { isPending: renameIsPending }] = useApi.RenameAccount();

  const readOnly = readIsPending || renameIsPending;

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
      if (renameIsPending) return;
      try {
        const { name } = formValues(event, fields);
        if (!isName(name)) return;
        const newName = normalizeName(name);
        throwIfInvalidName(newName);
        RENAME({ name: newName });
        setName(newName);
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidAccountName);
      }
    },
    [RENAME, renameIsPending]
  );

  // Read account data.
  useEffect(() => {
    const controller = READ({});
    return () => controller.abort();
  }, [READ]);

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
          <Button isOutlined isLoading={renameIsPending}>
            {buttonLabel.save}
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
