import {
	isSubscription,
	ReadSubscription,
	WriteSubscription
} from "@ggbot2/models"

import { READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readSubscription: ReadSubscription = (arg) =>
	READ<ReadSubscription>(isSubscription, pathname.subscription(arg))

export const writeSubscription: WriteSubscription = ({
	accountId,
	...subscription
}) => UPDATE(pathname.subscription({ accountId }), subscription)
