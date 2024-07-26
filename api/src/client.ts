import {
	BadRequestError,
	GatewayTimeoutError,
	InternalServerError,
	UnauthorizedError
} from "@workspace/http"

import {
	ActionInput,
	ApiActionOutput,
	isApiActionOutputData,
	isApiActionOutputError
} from "./action.js"
import { apiActionMethod } from "./api.js"
import { GenericError, TimeoutError } from "./errors.js"

export class ClientActionHeaders extends Headers {
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

class ActionAbortController extends AbortController {
	timeoutId: ReturnType<typeof setTimeout>

	constructor(timeout = 10_000) {
		super()

		this.timeoutId = setTimeout(() => {
			this.abort()
		}, timeout)

		this.signal.addEventListener("abort", () => {
			this.clearTimeout()
		})
	}

	clearTimeout() {
		clearTimeout(this.timeoutId)
	}
}

export async function clientAction<ActionType extends string>(
	url: URL | string,
	headers: ClientActionHeaders,
	{ type, data }: ActionInput<ActionType>
): Promise<ApiActionOutput> {
	const controller = new ActionAbortController()

	const response = await fetch(url, {
		body: JSON.stringify({ type, data }),
		headers,
		method: apiActionMethod,
		signal: controller.signal
	})

	if (controller.signal.aborted) throw new TimeoutError()
	controller.clearTimeout()

	try {
		if (!response.ok) throw response.status

		const output: unknown = await response.json()
		if (isApiActionOutputError(output)) return output
		if (isApiActionOutputData(output)) return output

		throw new GenericError()
	} catch (error) {
		for (const ErrorClass of [
			BadRequestError,
			InternalServerError,
			GatewayTimeoutError,
			UnauthorizedError
		])
			if (error === ErrorClass.statusCode) throw new ErrorClass()

		throw error
	}
}
