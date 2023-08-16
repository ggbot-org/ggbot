import { AccountStrategyKey } from "./accountStrategy.js"
import { Order } from "./order.js"
import { UpdateTime } from "./time.js"

/** Contains orders in a temporary state. */
export type OrdersPool = Order[]

export type ReadStrategyOrdersPool = (
	arg: AccountStrategyKey
) => Promise<OrdersPool>

export type WriteStrategyOrdersPoolInput = AccountStrategyKey & OrdersPool

export type WriteStrategyOrdersPool = (
	arg: WriteStrategyOrdersPoolInput
) => Promise<UpdateTime>
