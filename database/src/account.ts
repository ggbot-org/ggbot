import { getObject, listObjects } from "@ggbot2/aws";
import {
  AccountKey,
  ErrorItemNotFound,
  ErrorItemNotValid,
  ReadAccount,
  ReadAccountKeys,
  isAccount,
  isAccountKey,
} from "@ggbot2/models";

export function accountDirnamePrefix() {
  return "account";
}

export function accountDirname({ accountId }: AccountKey) {
  return `${accountDirnamePrefix()}/${accountId}`;
}

export function accountPathname({ accountId }: AccountKey) {
  return `${accountDirname({ accountId })}/account.json`;
}

export const readAccount: ReadAccount["resolver"] = async ({ accountId }) => {
  try {
    const Key = accountPathname({ accountId });
    const data = await getObject({ Key });
    if (!data) throw new ErrorItemNotFound();
    if (!isAccount(data)) throw new ErrorItemNotValid();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const readAccountKeys: ReadAccountKeys["resolver"] = async () => {
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
