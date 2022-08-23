import { isName, normalizeName } from "@ggbot2/models";
import { Button, EditableInput } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo, useState } from "react";
import { ApiAction, useApiAction } from "_hooks";

export const AccountSettings: FC = () => {
  const { data: account, isLoading: readIsLoading } =
    useApiAction.READ_ACCOUNT();

  const [renameAccountIn, setRenameAccountIn] =
    useState<ApiAction["RENAME_ACCOUNT"]["in"]>();
  const { isLoading: renameIsLoading } =
    useApiAction.RENAME_ACCOUNT(renameAccountIn);

  const name = useMemo(() => account?.name ?? "", [account]);

  const readOnly = useMemo(
    () => readIsLoading || renameIsLoading,
    [readIsLoading, renameIsLoading]
  );

  const setName = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (name === newName) return;

      setRenameAccountIn({
        name: newName,
      });
    },
    [name, readOnly]
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="text-xl">account</span>
      <EditableInput
        value={name}
        setValue={setName}
        readOnly={readOnly}
        isLoading={renameIsLoading}
      />
      <Button color="danger">Delete Account</Button>
    </div>
  );
};
