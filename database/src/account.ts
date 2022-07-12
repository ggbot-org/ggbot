import { getObject } from "@ggbot2/aws";
import {
  Account,
  AccountKey,
  ErrorItemNotFound,
  ReadAccount,
} from "@ggbot2/models";

export function accountDirname({ accountId }: AccountKey) {
  return `account/${accountId}`;
}

export function accountPathname({ accountId }: AccountKey) {
  return `${accountDirname({ accountId })}/account.json`;
}

export const readAccount: ReadAccount["resolver"] = async ({ accountId }) => {
  try {
    const Key = accountPathname({ accountId });
    const data = await getObject<Account>({ Key });
    if (!data) throw new ErrorItemNotFound();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
