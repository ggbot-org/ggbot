import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { AllowedCountryIsoCode2, isAllowedCountryIsoCode2 } from "./country.js"
import { EmailAddress, isEmailAddress } from "./email.js"
import { isItemId, Item, ItemKey, newId, NewItem } from "./item.js"
import { isName, Name, normalizeName } from "./name.js"
import {
	createdNow,
	CreationTime,
	DeletionTime,
	isCreationTime,
	UpdateTime
} from "./time.js"

const accountRoles = ["admin", "user"] as const
type AccountRole = (typeof accountRoles)[number]
const isAccountRole = isLiteralType<AccountRole>(accountRoles)

export type Account = Item &
	CreationTime & {
		email: EmailAddress
	} & Partial<{
		country: AllowedCountryIsoCode2
		name: Name
		/** The account role, defaults to "user" if omitted. */
		role: AccountRole
	}>

export const isAccount = objectTypeGuard<Account>(
	({ id, country, email, name, role, ...creationTime }) =>
		isItemId(id) &&
		isEmailAddress(email) &&
		isCreationTime(creationTime) &&
		(country === undefined ? true : isAllowedCountryIsoCode2(country)) &&
		(name === undefined ? true : isName(name)) &&
		(role === undefined ? true : isAccountRole(role))
)

export const isAdminAccount = ({ role }: Pick<Account, "role">): boolean =>
	role === "admin"

export const newAccount = ({ email, name }: NewItem<Account>): Account => {
	const optionalName =
		typeof name === "string" ? normalizeName(name) : undefined
	return {
		...createdNow(),
		id: newId(),
		email,
		name: optionalName
	}
}

export type AccountKey = ItemKey<{
	accountId: Account["id"]
}>

export const isAccountKey = objectTypeGuard<AccountKey>(({ accountId }) =>
	isItemId(accountId)
)

export type CreateAccount = (arg: NewItem<Account>) => Promise<Account>

export type ReadAccount = (arg: AccountKey) => Promise<Account | null>

export const isReadAccountInput = objectTypeGuard<AccountKey>((accountKey) =>
	isAccountKey(accountKey)
)

type RenameAccountInput = AccountKey & { name: Name }

export const isRenameAccountInput = objectTypeGuard<RenameAccountInput>(
	({ name, ...accountKey }) => isName(name) && isAccountKey(accountKey)
)

export type RenameAccount = (arg: RenameAccountInput) => Promise<UpdateTime>

type SetAccountCountryInput = AccountKey & {
	country: AllowedCountryIsoCode2
}

export const isSetAccountCountryInput = objectTypeGuard<SetAccountCountryInput>(
	({ country, ...accountKey }) =>
		isAllowedCountryIsoCode2(country) && isAccountKey(accountKey)
)

export type SetAccountCountry = (
	arg: SetAccountCountryInput
) => Promise<UpdateTime>

export type DeleteAccount = (arg: AccountKey) => Promise<DeletionTime>

export type ListAccountKeys = () => Promise<AccountKey[]>
