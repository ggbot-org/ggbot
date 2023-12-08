import {
	AppendAccountDailyOrders,
	ReadAccountDailyOrders
} from "@workspace/models"

import { READ_ARRAY, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

const readAccountDailyOrders: ReadAccountDailyOrders = (arg) =>
	READ_ARRAY<ReadAccountDailyOrders>(pathname.accountDailyOrders(arg))

export const appendAccountDailyOrders: AppendAccountDailyOrders = async ({
	items,
	...key
}) => {
	const currentItems = await readAccountDailyOrders(key)
	const data = currentItems ? [...currentItems, ...items] : items
	return await UPDATE(pathname.accountDailyOrders(key), data)
}
