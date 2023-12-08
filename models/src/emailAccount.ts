import { AccountKey } from "./account.js"
import { EmailAddress } from "./email.js"
import { ItemKey } from "./item.js"
import { CreationTime } from "./time.js"

export type EmailAccount = AccountKey &
	ItemKey<{ email: EmailAddress }> &
	CreationTime

type CreateEmailAccountInput = Omit<EmailAccount, "whenCreated">

export type CreateEmailAccount = (
	arg: CreateEmailAccountInput
) => Promise<CreationTime>

export type ReadEmailAccount = (
	arg: EmailAddress
) => Promise<EmailAccount | null>
