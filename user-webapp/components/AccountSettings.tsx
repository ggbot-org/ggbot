import { isAccount, isName, normalizeName } from "@ggbot2/models";
import {
  Button,
  DateTime,
  EditableInputField,
  Fieldset,
  OutputField,
} from "@ggbot2/ui-components";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiAction } from "_hooks";

export const AccountSettings: FC = () => {
  const [newName, setNewName] = useState("");

  const [readAccount, { data: account }] = useApiAction.READ_ACCOUNT();

  const [renameAccount, { isPending: renameIsPending }] =
    useApiAction.RENAME_ACCOUNT();

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

  const accountInfo = useMemo<{ label: string; value: ReactNode }[]>(
    () =>
      [
        {
          label: "email",
          value: email,
        },
        {
          label: "When created",
          value: whenCreated && <DateTime format="day" value={whenCreated} />,
        },
        {
          label: "id",
          value: accountId && <span className="text-xs">{accountId}</span>,
        },
      ].map(({ value, ...rest }) => ({
        value: value ? value : <>&nbsp;</>,
        ...rest,
      })),
    [accountId, email, whenCreated]
  );

  const readOnly = useMemo(
    () => account === undefined || renameIsPending,
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
    <div className="flex flex-col gap-4">
      <form>
        <Fieldset legend="Profile">
          <EditableInputField
            name="name"
            label="nick name"
            value={currentName}
            setValue={setName}
            readOnly={readOnly}
            isSpinning={renameIsPending}
          />

          <div>
            {accountInfo.map(({ label, value }, i) => (
              <OutputField key={i} label={label}>
                {value}
              </OutputField>
            ))}
          </div>
        </Fieldset>
      </form>

      <form>
        <Fieldset color="danger" legend="Danger zone">
          <menu>
            <li>
              <Button color="danger">Delete Account</Button>
            </li>
          </menu>
        </Fieldset>
      </form>
    </div>
  );
};
