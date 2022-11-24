import {
  Account,
  AccountKey,
  CreateAccount,
  DeleteAccount,
  ReadAccount,
  ReadAccountKeys,
  RenameAccount,
  createdNow,
  isAccountKey,
  throwIfInvalidName,
  updatedNow,
} from "@ggbot2/models";
import { randomUUID } from "crypto";
import {
  deleteObject,
  getObject,
  listObjects,
  putObject,
} from "./_dataBucket.js";
import { dirnamePrefix, pathname } from "./locators.js";
import { ErrorAccountItemNotFound } from "./errors.js";
import { createEmailAccount } from "./emailAccount.js";

export const createAccount: CreateAccount["func"] = async ({ email }) => {
  const accountId = randomUUID();
  const data: Account = {
    id: accountId,
    email,
    ...createdNow(),
  };
  const Key = pathname.account({ accountId });
  await putObject({ Key, data });
  await createEmailAccount({ accountId, email });
  return data;
};

export const readAccount: ReadAccount["func"] = async (accountKey) =>
  await getObject<ReadAccount["out"]>({ Key: pathname.account(accountKey) });

export const readAccountKeys: ReadAccountKeys["func"] = async () => {
  const Prefix = dirnamePrefix.account;
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

/**
 * @throws {ErrorInvalidArg}
 * @throws {ErrorAccountItemNotFound}
 */
export const renameAccount: RenameAccount["func"] = async ({
  accountId,
  name,
}) => {
  throwIfInvalidName(name);
  const account = await readAccount({ accountId });
  if (!account)
    throw new ErrorAccountItemNotFound({ type: "Account", accountId });
  const Key = accountPathname({ accountId });
  const data: Account = {
    ...account,
    name,
  };
  await putObject({ Key, data });
  return updatedNow();
};

export const deleteAccount: DeleteAccount["func"] = async (_) =>
  await deleteObject({ Key: accountPathname(_) });
