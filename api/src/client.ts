import { ApiActionInput, apiActionMethod } from "./action.js"
import { ApiActionHeaders } from "./headers.js"

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

