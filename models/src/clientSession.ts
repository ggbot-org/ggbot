import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { CreationDay, isCreationDay } from "./time.js"

/** A `ClientSession` starts on a day on behalf of an account. */
export type ClientSession = AccountKey & CreationDay

export const isClientSession = objectTypeGuard<ClientSession>(
	({ accountId, creationDay }) => isAccountKey({ accountId }) && isCreationDay({ creationDay })
)

export const clientSessionNumDays = 30
