import { SerializableData } from "@workspace/models"

export const apiActionMethod = "POST"

/**
 * An `ApiService` implements an API that can be consumed by a client. An
 * `ApiService` can have one or more `DataProvider`. An `ApiService` has a
 * method for every `ActionType`, invoked by a client; it validates the client
 * input and routes the action to the corresponding `DataProvider`.
 */
export type ApiService<ActionType extends string> =
	// Actions the client can call when interacts with the service.
	Record<ActionType, (arg: unknown) => Promise<SerializableData>>
