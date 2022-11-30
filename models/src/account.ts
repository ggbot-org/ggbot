import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, ItemKey, NewItem, isItemId, newId } from "./item.js";
import { Name, isName, normalizeName } from "./name.js";
import { objectTypeGuard } from "./objects.js";
import type { Operation } from "./operation.js";
import {
  CreationTime,
  DeletionTime,
  UpdateTime,
  createdNow,
  isCreationTime,
} from "./time.js";

export type Account = Item &
  CreationTime & {
    name?: undefined | Name;
    email: EmailAddress;
  };

export const isAccount = objectTypeGuard<Account>(
  ({ id, email, name, ...creationTime }) =>
    isItemId(id) &&
    isEmailAddress(email) &&
    isCreationTime(creationTime) &&
    (name !== undefined ? isName(name) : true)
);

export const newAccount = ({ email, name }: NewItem<Account>): Account => {
  const optionalName =
    typeof name === "string" ? normalizeName(name) : undefined;
  return {
    ...createdNow(),
    id: newId(),
    email,
    name: optionalName,
  };
};

export type AccountKey = ItemKey<{
  accountId: Account["id"];
}>;

export const isAccountKey = objectTypeGuard<AccountKey>(({ accountId }) =>
  isItemId(accountId)
);

export type CreateAccount = Operation<NewItem<Account>, Account>;

export type ReadAccount = Operation<AccountKey, Account | null>;

export type RenameAccount = Operation<AccountKey & { name: Name }, UpdateTime>;

export type DeleteAccount = Operation<AccountKey, DeletionTime>;

export type ListAccountKeys = Operation<void, AccountKey[]>;
