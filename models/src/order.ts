import { Item, newId, NewItem } from "./item.js"
import { SerializableObject } from "./serializable.js"
import { createdNow, CreationTime } from "./time.js"

export type Order = Item &
	CreationTime & {
		info: SerializableObject
	}

export const newOrder = ({ info }: NewItem<Order>): Order => ({
	...createdNow(),
	id: newId(),
	info
})
