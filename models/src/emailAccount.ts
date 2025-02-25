import { AccountKey } from './account.js'
import { EmailAddress } from './email.js'
import { ItemKey } from './item.js'
import { CreationTime } from './time.js'

export type EmailAccount = AccountKey &
	CreationTime &
	ItemKey<'email', { email: EmailAddress }>
