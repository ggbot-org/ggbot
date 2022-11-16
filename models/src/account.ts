import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, NewItem, isItemId } from "./item.js";
import { Name, isName } from "./name.js";
import {
  CreationTime,
  DeletionTime,
  UpdateTime,
  isCreationTime,
} from "./time.js";
import type { Operation } from "./operation.js";

export type Account = Item &
  CreationTime & {
    name?: undefined | Name;
    email: EmailAddress;
  };

export const isAccount = (value: unknown): value is Account => {
  if (typeof value !== "object" || value === null) return false;
  const { id, email, name, whenCreated } = value as Partial<Account>;
  return (
    isItemId(id) &&
    isEmailAddress(email) &&
    isCreationTime({ whenCreated }) &&
    (name !== undefined ? isName(name) : true)
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

export type ReadAccount = Operation<AccountKey, Account | null>;

export type RenameAccount = Operation<AccountKey & { name: Name }, UpdateTime>;

export type ReadAccountKeys = Operation<void, AccountKey[]>;

export type DeleteAccount = Operation<AccountKey, DeletionTime>;
