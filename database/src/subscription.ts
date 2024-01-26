import { AccountKey, Subscription, UpdateTime } from "@workspace/models"

import { UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

type WriteSubscription = (arg: AccountKey & Subscription) => Promise<UpdateTime>

export const writeSubscription: WriteSubscription = ({
	accountId,
	...subscription
}) => UPDATE(pathname.subscription({ accountId }), subscription)
