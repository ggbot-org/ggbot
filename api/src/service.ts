import { SerializableData } from "@workspace/models"

/**
 * A Service implements an API that can be consumed by a client and interacts
 * with one or more services via a DataProvider. The client has an instance of
 * the Service and invokes methods defined by ActionType.
 */
export type Service<ActionType extends string, DataProvider extends object> = {
	readonly dataProvider: DataProvider
} & Record<ActionType, (arg: unknown) => Promise<SerializableData>>
