import {
	accountKeyFieldNames,
	strategyKeyFieldNames,
	subscriptionPurchaseKeyFieldNames,
} from './fields.js'
import { SerializablePrimitive } from './serializable.js'
import { CreationTime } from './time.js'

type ItemId = string

export const nullId = '00000000'

export function isItemId(arg: unknown): arg is ItemId {
	return typeof arg === 'string' && arg.length === nullId.length
}

const _itemKeyFieldNames = [
	...accountKeyFieldNames,
	...strategyKeyFieldNames,
	...subscriptionPurchaseKeyFieldNames,
	'apiKey',
	'apiSecret',
	'email',
	'schedulingId',
]
type ItemKeyFieldName = (typeof _itemKeyFieldNames)[number]

/** An `Item` can have a "key" that associate it to other items. */
export type ItemKey<Fields extends ItemKeyFieldName, Key> = Readonly<
	Key extends { [fieldName in Fields]: SerializablePrimitive } ? Key : never
>

/** An `Item` is identified by its `id`. */
export type Item = ItemKey<'id', { id: ItemId }>

export function newId(): ItemId {
	return nullId.replace(/0/g, () =>
		(Math.floor(Date.now() + Math.random() * 16) % 16).toString(16)
	)
}

export type NewItem<T extends Item> = T extends Item & CreationTime
	? Omit<T, 'id' | 'whenCreated'>
	: Omit<T, 'id'>
