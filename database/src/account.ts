import {
  Account,
  AccountKey,
  CreateAccount,
  DeleteAccount,
  ErrorAccountItemNotFound,
  isAccount,
  isAccountKey,
  ListAccountKeys,
  newAccount,
  ReadAccount,
  RenameAccount,
  SetAccountCountry,
  throwIfInvalidName,
  updatedNow,
} from "@ggbot2/models";

import { DELETE, GET, listObjects, putObject } from "./_dataBucket.js";
import { createEmailAccount } from "./emailAccount.js";
import {
  dirnameDelimiter,
  dirnamePrefix,
  locatorToItemKey,
  pathname,
} from "./locators.js";

export const createAccount: CreateAccount["func"] = async ({ email }) => {
  const account = newAccount({ email });
  const accountId = account.id;
  const Key = pathname.account({ accountId });
  await putObject({ Key, data: account });
  await createEmailAccount({ accountId, email });
  return account;
};

export const readAccount: ReadAccount["func"] = (accountKey) =>
  GET<ReadAccount["out"]>(isAccount, pathname.account(accountKey));

const getAccountOrThrow = async ({
  accountId,
}: AccountKey): Promise<Account> => {
  const account = await readAccount({ accountId });
  if (!account)
    throw new ErrorAccountItemNotFound({ type: "Account", accountId });
  return account;
};

export const listAccountKeys: ListAccountKeys["func"] = async () => {
  const Prefix = dirnamePrefix.account + dirnameDelimiter;
  const results = await listObjects({
    Prefix,
  });
  if (!Array.isArray(results.Contents)) return Promise.resolve([]);
  return (
    results.Contents.reduce<AccountKey[]>((list, { Key }) => {
      if (typeof Key !== "string") return list;
      const itemKey = locatorToItemKey.account(Key);
      return isAccountKey(itemKey) ? list.concat(itemKey) : list;
    }, []) ?? []
  );
};

export const renameAccount: RenameAccount["func"] = async ({
  accountId,
  name,
}) => {
  throwIfInvalidName(name);
  const account = await getAccountOrThrow({ accountId });
  const Key = pathname.account({ accountId });
  const data: Account = {
    ...account,
    name,
  };
  await putObject({ Key, data });
  return updatedNow();
};

export const setAccountCountry: SetAccountCountry["func"] = async ({
  accountId,
  country,
}) => {
  const account = await getAccountOrThrow({ accountId });
  const Key = pathname.account({ accountId });
  const data: Account = {
    ...account,
    country,
  };
  await putObject({ Key, data });
  return updatedNow();
};

export const deleteAccount: DeleteAccount["func"] = (arg) =>
  DELETE(pathname.account(arg));
