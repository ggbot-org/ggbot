import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, NewItem, isItem, isItemId } from "./item.js";
import type { DeletionTime } from "./time.js";
import type { Operation } from "./operation.js";

export type Account = Item & {
  email: EmailAddress;
};

export function isAccount(value: unknown): value is Account {
  if (!isItem(value)) return false;
  const { email } = value as Partial<Account>;
  return isEmailAddress(email);
}

export type AccountKey = Readonly<{
  accountId: Account["id"];
}>;

export function isAccountKey(value: unknown): value is AccountKey {
  if (typeof value !== "object" || value === null) return false;
  const { accountId } = value as Partial<AccountKey>;
  return isItemId(accountId);
}

export type CreateAccount = Operation<NewItem<Account>, Account>;

export type ReadAccount = Operation<AccountKey, Account>;

export type ReadAccountKeys = Operation<void, AccountKey[]>;

export type DeleteAccount = Operation<AccountKey, DeletionTime>;
