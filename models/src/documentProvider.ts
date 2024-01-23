import { SerializableData } from "./serializable.js"
import {DeletionTime, UpdateTime} from "./time.js"

export type DocumentProvider = {
	getItem(key: string): Promise<SerializableData>
	removeItem(key: string): Promise<DeletionTime>
	setItem(key: string, value: SerializableData): Promise<UpdateTime>
}
