import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	UpdateTime
} from "@workspace/models"

import { READ_ARRAY, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

type ReadAccountDailyOrders = (
	arg: AccountDailyOrdersKey
) => Promise<AccountDailyOrder[]>

const readAccountDailyOrders: ReadAccountDailyOrders = (arg) =>
	READ_ARRAY<ReadAccountDailyOrders>(pathname.accountDailyOrders(arg))

export type AppendAccountDailyOrders = (
	arg: AccountDailyOrdersKey & {
		items: AccountDailyOrder[]
	}
) => Promise<UpdateTime>

export const appendAccountDailyOrders: AppendAccountDailyOrders = async ({
	items,
	...key
}) => {
	const currentItems = await readAccountDailyOrders(key)
	const data = currentItems ? [...currentItems, ...items] : items
	return await UPDATE(pathname.accountDailyOrders(key), data)
}
