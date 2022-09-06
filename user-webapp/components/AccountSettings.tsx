import { isName, normalizeName } from "@ggbot2/models";
import {
  Button,
  DateTime,
  EditableInput,
  Fieldset,
} from "@ggbot2/ui-components";
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
    <>
      <dl>
        <dt>email</dt>
        <dd>{account?.email}</dd>
        <dt>nickname</dt>
        <dd>{name}</dd>
        <dt>when created</dt>
        <dd>
          {account && <DateTime format="day" value={account?.whenCreated} />}
        </dd>
        <dt>id</dt>
        <dd className="text-xs">{account?.id}</dd>
      </dl>
      <form>
        <Fieldset legend="account">
          <EditableInput
            value={name}
            setValue={setName}
            readOnly={readOnly}
            isLoading={renameIsLoading}
          />
        </Fieldset>
        <menu>
          <Button color="danger">Delete Account</Button>
        </menu>
      </form>
    </>
  );
};
