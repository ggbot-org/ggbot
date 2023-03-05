import {
  Box,
  Button,
  ButtonOnClick,
  EditableInputField,
  InputField,
  useFormattedDate,
} from "@ggbot2/design";
import { isAccount, isName, normalizeName } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const AccountSettings: FC = () => {
  const router = useRouter();

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

  const accountInfo = useMemo<{ label: string; value: string }[]>(
    () => [
      {
        label: "Email",
        value: email,
      },
      {
        label: "When created",
        value: formattedDate,
      },
      {
        label: "Account id",
        value: accountId,
      },
    ],
    [accountId, email, formattedDate]
  );

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

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      router.push(route.deleteAccountPage());
    },
    [router]
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
    <>
      <Box>
        <EditableInputField
          name="name"
          label="Nick name"
          value={currentName}
          setValue={setName}
          readOnly={readOnly}
          isSpinning={renameIsPending}
        />

        <>
          {accountInfo.map(({ label, value }, i) => (
            <InputField key={i} label={label} defaultValue={value} readOnly isStatic />
          ))}
        </>
      </Box>

      <Button color="danger" onClick={onClickDelete}>
        Delete account
      </Button>
    </>
  );
};
