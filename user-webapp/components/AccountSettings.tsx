import { Box, EditableInputField, InputField, useFormattedDate } from "@ggbot2/design";
import { isAccount, isName, normalizeName } from "@ggbot2/models";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { fieldLabel } from "_i18n";

export const AccountSettings: FC = () => {
  const [newName, setNewName] = useState("");

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const [renameAccount, { isPending: renameIsPending }] = useApiAction.RenameAccount();

  const { accountId, currentName, email, whenCreated } = useMemo(
    () =>
      isAccount(account)
        ? {
            accountId: account.id,
            currentName: account.name ?? "",
            email: account.email,
            whenCreated: account.whenCreated,
          }
        : {
            accountId: "",
            currentName: "",
            email: "",
            whenCreated: "",
          },
    [account]
  );

  const formattedDate = useFormattedDate(whenCreated, "day");

  const readOnly = useMemo(() => account === undefined || renameIsPending, [account, renameIsPending]);

  const setName = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (currentName === newName) return;
      setNewName(newName);
    },
    [currentName, readOnly, setNewName]
  );

  useEffect(() => {
    if (!newName) return;
    const controller = renameAccount({ name: newName });
    return () => {
      controller.abort();
    };
  }, [renameAccount, newName]);

  useEffect(() => {
    const controller = readAccount({});
    return () => {
      controller.abort();
    };
  }, [readAccount]);

  return (
    <Box>
      <EditableInputField
        name="name"
        label={fieldLabel.nickName}
        value={currentName}
        setValue={setName}
        readOnly={readOnly}
        isSpinning={renameIsPending}
      />

      <InputField label={fieldLabel.email} defaultValue={email} readOnly />

      <InputField label={fieldLabel.whenCreated} defaultValue={formattedDate} readOnly />

      <InputField label={fieldLabel.accountId} defaultValue={accountId} readOnly />
    </Box>
  );
};
