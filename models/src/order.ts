import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { isItemId, Item, newId, NewItem } from "./item.js"
import { isSerializableObject, SerializableObject } from "./serializable.js"
import { createdNow, CreationTime, isCreationTime } from "./time.js"

export type Order = Item &
	CreationTime & {
		info: SerializableObject
	}

const isOrder = objectTypeGuard<Order>(
	({ id, info, ...creationTime }) =>
		isItemId(id) &&
		isCreationTime(creationTime) &&
		isSerializableObject(info)
)

export type Orders = Order[]
export const isOrders = arrayTypeGuard<Order>(isOrder)

export const newOrder = ({ info }: NewItem<Order>): Order => ({
	...createdNow(),
	id: newId(),
	info
})
