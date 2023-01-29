import { objectTypeGuard } from "@ggbot2/type-utils";
import {
  AllowedCountryIsoCode2,
  isAllowedCountryIsoCode2,
} from "./countries.js";
import { EmailAddress, isEmailAddress } from "./email.js";
import { Item, ItemKey, NewItem, isItemId, newId } from "./item.js";
import { Name, isName, normalizeName } from "./name.js";
import { Operation } from "./operation.js";
import {
  CreationTime,
  DeletionTime,
  UpdateTime,
  createdNow,
  isCreationTime,
} from "./time.js";

export type Account = Item &
  CreationTime & {
    country?: AllowedCountryIsoCode2;
    name?: undefined | Name;
    email: EmailAddress;
  };

export const isAccount = objectTypeGuard<Account>(
  ({ id, country, email, name, ...creationTime }) =>
    isItemId(id) &&
    isEmailAddress(email) &&
    isCreationTime(creationTime) &&
    (country === undefined ? true : isAllowedCountryIsoCode2(country)) &&
    (name === undefined ? true : isName(name))
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

export type SetAccountCountry = Operation<
  AccountKey & { country: AllowedCountryIsoCode2 },
  UpdateTime
>;

export type DeleteAccount = Operation<AccountKey, DeletionTime>;

export type ListAccountKeys = Operation<void, AccountKey[]>;
