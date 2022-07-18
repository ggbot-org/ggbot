import { getObject } from "@ggbot2/aws";
import {
  AccountKey,
  ErrorItemNotFound,
  ErrorItemNotValid,
  ReadAccount,
  isAccount,
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
    const data = await getObject({ Key });
    if (!data) throw new ErrorItemNotFound();
    if (!isAccount(data)) throw new ErrorItemNotValid();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
