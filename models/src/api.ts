import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { SerializableData } from "./serializable.js"

export type ApiActionInput<ActionType extends string> = {
	type: ActionType
	data?: unknown
}

export const isApiActionInput = <ActionType extends string>(
	actionTypes: readonly ActionType[]
) =>
	objectTypeGuard<ApiActionInput<ActionType>>(({ type }) =>
		isLiteralType<ActionType>(actionTypes)(type)
	)

export class ApiActionHeaders extends Headers {
	constructor() {
		super({
			Accept: "application/json",
			"Content-Type": "application/json"
		})
	}
	appendAuthorization(token: string) {
		this.append("Authorization", token)
	}
}

export const apiActionMethod = "POST"

export const apiActionRequestInit = <ActionType extends string>({
	headers,
	type,
	data,
	...rest
}: Omit<RequestInit, "method" | "body" | "headers"> &
	ApiActionInput<ActionType> & {
		headers: ApiActionHeaders
	}) => ({
	body: JSON.stringify({ type, data }),
	headers,
	method: apiActionMethod,
	...rest
})

/**
 * An `ApiService` implements an API that can be consumed by a client. An
 * `ApiService` can have one or more `ApiDataProvider`. An `ApiService` has a
 * method for every `ActionType`, invoked by a client; it validates the client
 * input and routes the action to the corresponding `ApiDataProvider`.
 */
export type ApiService<ActionType extends string> =
	// Actions the client can call when interacts with the service.
	Record<ActionType, (arg: unknown) => Promise<SerializableData>>

/** An `ApiService` can have one or more `ApiDataProvider`. */
export type ApiDataProvider<ActionType extends string> = Record<
	ActionType,
	(...args: any[]) => Promise<SerializableData>
>
