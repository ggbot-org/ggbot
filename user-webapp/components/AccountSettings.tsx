import { isName, normalizeName } from "@ggbot2/models";
import {
  Button,
  DateTime,
  EditableInput,
  Fieldset,
} from "@ggbot2/ui-components";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";

export const AccountSettings: FC = () => {
  const [newName, setNewName] = useState("");

  const [readAccount, { data: account }] = useApiAction.READ_ACCOUNT();

  const [renameAccount, { isPending: renameIsPending }] =
    useApiAction.RENAME_ACCOUNT();

  const currentName = useMemo(() => account?.name ?? "", [account]);

  const readOnly = useMemo(
    () => typeof account === "undefined" || renameIsPending,
    [account, renameIsPending]
  );

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
    if (newName) return renameAccount({ data: { name: newName } });
  }, [renameAccount, newName]);

  useEffect(readAccount, [readAccount]);

  return (
    <>
      <dl>
        <dt>email</dt>
        <dd>{account?.email}</dd>
        <dt>nickname</dt>
        <dd>{currentName}</dd>
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
            value={currentName}
            setValue={setName}
            readOnly={readOnly}
            isSpinning={renameIsPending}
          />
        </Fieldset>
        <menu>
          <li>
            <Button color="danger">Delete Account</Button>
          </li>
        </menu>
      </form>
    </>
  );
};
