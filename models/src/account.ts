import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, NewItem, isItemId } from "./item.js";
import { CreationTime, DeletionTime, isCreationTime } from "./time.js";
import type { Operation } from "./operation.js";

export type Account = Item &
  CreationTime & {
    email: EmailAddress;
  };

export const isAccount = (value: unknown): value is Account => {
  if (typeof value !== "object" || value === null) return false;
  const { id, email, whenCreated } = value as Partial<Account>;
  return (
    isItemId(id) && isEmailAddress(email) && isCreationTime({ whenCreated })
  );
};

export type AccountKey = {
  readonly accountId: Account["id"];
};

export const isAccountKey = (value: unknown): value is AccountKey => {
  if (typeof value !== "object" || value === null) return false;
  const { accountId } = value as Partial<AccountKey>;
  return isItemId(accountId);
};

export type CreateAccount = Operation<NewItem<Account>, Account>;

export type ReadAccount = Operation<AccountKey, Account | undefined>;

export type ReadAccountKeys = Operation<void, AccountKey[]>;

export type DeleteAccount = Operation<AccountKey, DeletionTime>;
