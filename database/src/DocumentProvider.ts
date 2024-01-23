import { SerializableData } from "@workspace/models"

export type DocumentProvider = {
	READ(key: string): Promise<SerializableData>
	DELETE(key: string): Promise<void>
	WRITE(key: string, value: SerializableData): Promise<void>
}
