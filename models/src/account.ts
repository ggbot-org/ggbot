import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, NewItem, isItem } from "./item.js";
import type { DeletionTime } from "./time.js";
import type { Operation } from "./operation.js";

export type Account = Item & {
  email: EmailAddress;
};

export function isAccount(value: unknown): value is Account {
  if (!isItem(value)) return false;
  if (typeof value !== "object" || value === null) return false;
  const { email } = value as Partial<Account>;
  if (!isEmailAddress(email)) return false;
  return true;
}

export type AccountKey = Readonly<{
  accountId: Account["id"];
}>;

export type CreateAccount = Operation<NewItem<Account>, Account>;
export type ReadAccount = Operation<AccountKey, Account>;
export type DeleteAccount = Operation<AccountKey, DeletionTime>;
