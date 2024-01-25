import {ApiActionInput} from "./action.js"

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

export const apiActionRequestInit = <ActionType extends string>({
	headers,
	type,
	data,
	...rest
}: Omit<RequestInit, "method" | "body" | "headers"> &
	ApiActionInput<ActionType> & {
		headers: ApiActionHeaders
	}) => ({
		body: JSON.stringify({type, data}),
		headers,
		method: "POST",
		...rest
	})
