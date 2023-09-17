import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { EmailAddress, isEmailAddress } from "./email.js"
import { ItemKey } from "./item.js"
import { CreationTime, isCreationTime } from "./time.js"

export type EmailAccount = AccountKey &
	ItemKey<{ email: EmailAddress }> &
	CreationTime

export const isEmailAccount = objectTypeGuard<EmailAccount>(
	({ accountId, email, ...creationTime }) =>
		isAccountKey({ accountId }) &&
		isCreationTime(creationTime) &&
		isEmailAddress(email)
)

export type CreateEmailAccountInput = Omit<EmailAccount, "whenCreated">

export type CreateEmailAccount = (
	arg: CreateEmailAccountInput
) => Promise<CreationTime>

export type ReadEmailAccount = (
	arg: EmailAddress
) => Promise<EmailAccount | null>
