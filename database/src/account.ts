import { getObject, listObjects, putObject } from "@ggbot2/aws";
import {
  AccountKey,
  ErrorItemNotValid,
  ReadAccount,
  ReadAccountKeys,
  isAccount,
  isAccountKey,
  CreateAccount,
  Account,
  createdNow,
} from "@ggbot2/models";
import { v4 as uuidv4 } from "uuid";
import { createEmailAccount } from "./emailAccount.js";

export const accountDirnamePrefix = () => "account";

export const accountDirname = (accountKey: AccountKey) =>
  `${accountDirnamePrefix()}/${accountKeyToDirname(accountKey)}`;

export const accountKeyToDirname = ({ accountId }: AccountKey) =>
  `accountId=${accountId}`;

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

export const readAccount: ReadAccount["func"] = async ({ accountId }) => {
  const Key = accountPathname({ accountId });
  const data = await getObject({ Key });
  if (!data) return;
  if (!isAccount(data)) throw new ErrorItemNotValid();
  return data;
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
