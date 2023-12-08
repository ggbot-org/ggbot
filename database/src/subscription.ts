import { ReadSubscription, WriteSubscription } from "@workspace/models"

import { READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readSubscription: ReadSubscription = (arg) =>
	READ<ReadSubscription>(pathname.subscription(arg))

export const writeSubscription: WriteSubscription = ({
	accountId,
	...subscription
}) => UPDATE(pathname.subscription({ accountId }), subscription)
