import { deleteObject, getObject, listObjects, putObject } from "@ggbot2/aws";
import {
  Account,
  AccountKey,
  CreateAccount,
  DeleteAccount,
  ReadAccount,
  ReadAccountKeys,
  createdNow,
  deletedNow,
  isAccountKey,
} from "@ggbot2/models";
import { v4 as uuidv4 } from "uuid";
import { accountKeyToDirname } from "./accountKey.js";
import { createEmailAccount } from "./emailAccount.js";

export const accountDirnamePrefix = () => "account";

export const accountDirname = (accountKey: AccountKey) =>
  `${accountDirnamePrefix()}/${accountKeyToDirname(accountKey)}`;

export const accountPathname = (accountKey: AccountKey) =>
  `${accountDirname(accountKey)}/account.json`;

export const createAccount: CreateAccount["func"] = async ({ email }) => {
  const accountId = uuidv4();
  const data: Account = {
    id: accountId,
    email,
    ...createdNow(),
  };
  const Key = accountPathname({ accountId });
  await putObject({ Key, data });
  await createEmailAccount({ accountId, email });
  return data;
};

export const readAccount: ReadAccount["func"] = async (accountKey) => {
  const Key = accountPathname(accountKey);
  const data = await getObject({ Key });
  if (!data) return;
  return data as Account;
};

export const readAccountKeys: ReadAccountKeys["func"] = async () => {
  const Prefix = accountDirnamePrefix();
  const results = await listObjects({
    Prefix,
  });
  if (!Array.isArray(results.Contents)) return Promise.resolve([]);
  return (
    results.Contents.reduce<AccountKey[]>((list, { Key }) => {
      if (typeof Key !== "string") return list;
      // TODO
      // change folder structure
      //
      // from
      //
      // account/xxx/account.json
      //            /strategies.json
      //            /subscription.json
      //
      // to
      //
      // account/accountId=xxx/account.json
      // accountStrategies/accountId=xxx/strategies.json
      // accountSubscription/accountId=xxx/subscription.json
      //
      // By now this custom logic is implemented
      // to get unique accounts and parse account key
      if (!Key.includes("account.json")) return list;

      const accountId = Key.split("/")[1];
      const accountKey = { accountId };
      if (isAccountKey(accountKey)) return list.concat(accountKey);

      return list;
    }, []) ?? []
  );
};

export const deleteAccount: DeleteAccount["func"] = async (accountKey) => {
  const Key = accountPathname(accountKey);
  await deleteObject({ Key });
  return deletedNow();
};
