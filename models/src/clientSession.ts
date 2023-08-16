import { getDay, today } from "@ggbot2/time"
import { objectTypeGuard } from "@ggbot2/type-utils"

import { AccountKey, isAccountKey } from "./account.js"
import { CreationDay, isCreationDay } from "./time.js"

export type ClientSession = AccountKey & CreationDay

export const isClientSession = objectTypeGuard<ClientSession>(
	({ accountId, creationDay }) =>
		isAccountKey({ accountId }) && isCreationDay({ creationDay })
)

export const clientSessionNumDays = 30

export const clientSessionIsExpired = ({
	creationDay
}: Pick<ClientSession, "creationDay">) => {
	const expirationDay = getDay(creationDay).plus(clientSessionNumDays).days()
	return expirationDay < today()
}
