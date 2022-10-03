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
  const [readAccount, { data: account }] = useApiAction.READ_ACCOUNT();

  const [renameAccount, { isPending: renameIsPending }] =
    useApiAction.RENAME_ACCOUNT();

  const name = useMemo(() => account?.name ?? "", [account]);

  const readOnly = useMemo(
    () => typeof account === "undefined" || renameIsPending,
    [account, renameIsPending]
  );

  const setName = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (name === newName) return;

      renameAccount({
        data: {
          name: newName,
        },
      });
    },
    [name, readOnly, renameAccount]
  );

  useEffect(() => {
    readAccount();
  }, [readAccount]);

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
            isSpinning={renameIsPending}
          />
        </Fieldset>
        <menu>
          <Button color="danger">Delete Account</Button>
        </menu>
      </form>
    </>
  );
};
