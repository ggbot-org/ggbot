import { SerializableData } from "./serializable.js"

/**
 * A `Service` implements an API that can be consumed by a client and interacts
 * with one or more services via a `DataProvider`.
 *
 * The client has a connection to the `Service`.
 * It can invokes methods defined by `ActionType`.
 */
export type Service<ActionType extends string> =
	// Actions the client can call when interacts with the service.
	Record<ActionType, (arg: unknown) => Promise<SerializableData>>


export type ServiceInputValidator<ActionType extends string> = Record<ActionType, (arg: unknown) => boolean>
