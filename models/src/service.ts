import { SerializableData } from "./serializable.js"

/**
 * A `Service` implements an API that can be consumed by a client and interacts
 * with one or more services via a `DataProvider`.
 *
 * The client has a connection to the `Service`. It can invoke methods named by
 * `OperationName`.
 */
export type Service<OperationName extends string> =
	// Actions the client can call when interacts with the service.
	Record<OperationName, (arg: unknown) => Promise<SerializableData>>
