import {
	AppendAccountDailyOrders,
	isAccountDailyOrders,
	ReadAccountDailyOrders
} from "@workspace/models"

import { READ_ARRAY, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readAccountDailyOrders: ReadAccountDailyOrders = (arg) =>
	READ_ARRAY<ReadAccountDailyOrders>(
		isAccountDailyOrders,
		pathname.accountDailyOrders(arg)
	)

export const appendAccountDailyOrders: AppendAccountDailyOrders = async ({
	items,
	...key
}) => {
	const currentItems = await readAccountDailyOrders(key)
	const data = currentItems ? [...currentItems, ...items] : items
	return await UPDATE(pathname.accountDailyOrders(key), data)
}
