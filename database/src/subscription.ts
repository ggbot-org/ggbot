import { UserApiDataProviderOperation as Operation } from "@workspace/api"
import { AccountKey, Subscription, UpdateTime } from "@workspace/models"

import { READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readSubscription: Operation["ReadSubscription"] = (arg) =>
	READ<Operation["ReadSubscription"]>(pathname.subscription(arg))

type WriteSubscription = (arg: AccountKey & Subscription) => Promise<UpdateTime>

export const writeSubscription: WriteSubscription = ({
	accountId,
	...subscription
}) => UPDATE(pathname.subscription({ accountId }), subscription)
