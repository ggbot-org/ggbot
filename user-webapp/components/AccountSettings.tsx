import { isAccount, isName, normalizeName } from "@ggbot2/models";
import {
  Button,
  ButtonOnClick,
  DateTime,
  EditableInputField,
  OutputField,
  Section,
} from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const AccountSettings: FC = () => {
  const router = useRouter();

  const [newName, setNewName] = useState("");

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const [renameAccount, { isPending: renameIsPending }] =
    useApiAction.RenameAccount();

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
          value: accountId && <code>{accountId}</code>,
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

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      router.push(route.deleteAccountPage());
    },
    [router]
  );

  const onClickExit = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      router.push(route.authPage());
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
    <div className="flex flex-col gap-4">
      <Section header="Profile">
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

        <menu>
          <li>
            <Button type="reset" color="danger" onClick={onClickExit}>
              Exit
            </Button>
          </li>
        </menu>
      </Section>

      <Section color="danger" header="Danger zone">
        <menu>
          <li>
            <Button color="danger" onClick={onClickDelete}>
              Delete account
            </Button>
          </li>
        </menu>
      </Section>
    </div>
  );
};
