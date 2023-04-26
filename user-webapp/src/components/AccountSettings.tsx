import {
  Box,
  EditableInputField,
  OutputField,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { isAccount, isName, normalizeName } from "@ggbot2/models";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "_hooks/useApi";
import { fieldLabel } from "_i18n";

export const AccountSettings: FC = () => {
  const [newName, setNewName] = useState("");

  const [READ_ACCOUNT, { data: account }] = useApi.ReadAccount();

  const [RENAME_ACCOUNT, { isPending: renameIsPending }] =
    useApi.RenameAccount();

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

  const readOnly = account === undefined || renameIsPending;

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
    const controller = RENAME_ACCOUNT({ name: newName });
    return () => controller.abort();
  }, [RENAME_ACCOUNT, newName]);

  useEffect(() => {
    const controller = READ_ACCOUNT({});
    return () => controller.abort();
  }, [READ_ACCOUNT]);

  return (
    <Box>
      <Title>Account</Title>

      <EditableInputField
        name="name"
        label={fieldLabel.nickName}
        value={currentName}
        setValue={setName}
        readOnly={readOnly}
        isSpinning={renameIsPending}
      />

      <OutputField label={fieldLabel.email} value={email} />

      <OutputField label={fieldLabel.whenCreated} value={formattedDate} />

      <OutputField label={fieldLabel.accountId} value={accountId} />
    </Box>
  );
};
