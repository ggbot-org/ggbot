import { arrayTypeGuard, objectTypeGuard } from "@workspace/type-utils"
import { Dflow, DflowObject } from "dflow"

import { isItemId, Item, newId, NewItem } from "./item.js"
import { createdNow, CreationTime, isCreationTime } from "./time.js"

export type Order = Item &
	CreationTime & {
		info: DflowObject
	}

export const isOrder = objectTypeGuard<Order>(
	({ id, info, ...creationTime }) =>
		isItemId(id) && isCreationTime(creationTime) && Dflow.isObject(info)
)

export type Orders = Order[]
export const isOrders = arrayTypeGuard<Order>(isOrder)

export const newOrder = ({ info }: NewItem<Order>): Order => ({
	...createdNow(),
	id: newId(),
	info
})
