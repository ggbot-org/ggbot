import { ENV } from "@ggbot2/env"
import {
	ApiActionClientSideError,
	ApiActionServerSideError
} from "@workspace/api"
import {
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__,
	__502__BAD_GATEWAY__,
	BadGatewayError,
	BadRequestError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from "@workspace/http"
import { useCallback, useState } from "react"

import { localWebStorage } from "../storages/local.js"

type UseActionHeadersConstructorArg = {
	withJwt?: boolean
}

class UseActionHeaders extends Headers {
	constructor({ withJwt = false }: UseActionHeadersConstructorArg) {
		super({
			Accept: "application/json",
			"Content-Type": "application/json"
		})
		if (withJwt) {
			this.append("Authorization", `Bearer ${localWebStorage.jwt.get()}`)
		}
	}
}

class UseActionAbortController extends AbortController {
	timeoutId = 0

	constructor() {
		super()

		this.timeoutId = window.setTimeout(() => {
			this.abort()
		}, 10000)

		this.signal.addEventListener("abort", () => {
			this.clearTimeout()
		})
	}

	clearTimeout() {
		window.clearTimeout(this.timeoutId)
	}
}

export type UseActionError =
	| ApiActionClientSideError
	| ApiActionServerSideError
	| undefined

const isDev = ENV.DEPLOY_STAGE() !== "main"

/**
 * Hook to use API actions:
 *
 * CREATE_STRATEGY, READ_ACCOUNT, WRITE_STRATEGY_FLOW, etc.
 *
 * First, define available actions.
 *
 * @example
 *
 * ```ts
 * const endpoint = "/api/action"
 *
 * export const FooBar = useAction({ endpoint }, "FooBar")
 * ```
 *
 * Then call it in a `useEffect`.
 *
 * @example
 *
 * ```ts
 * useEffect(() => {
 * 	if (FooBar.canRun) FooBar.request({ param })
 * }, [FooBar])
 * ```
 */
export const useAction = <
	Operation extends (arg: any) => Promise<any>,
	ActionType extends string
>(
	{
		endpoint,
		withJwt
	}: { endpoint: string } & UseActionHeadersConstructorArg,
	type: ActionType
) => {
	const [data, setData] = useState<
		Awaited<ReturnType<Operation>> | undefined
	>()
	const [error, setError] = useState<UseActionError>()
	const [isPending, setIsPending] = useState<boolean | undefined>()

	const reset = useCallback(() => {
		setData(undefined)
		setError(undefined)
		setIsPending(undefined)
	}, [])

	const request = useCallback(
		(inputData: Parameters<Operation>[0]) => {
			;(async function () {
				const controller = new UseActionAbortController()

				try {
					const options: RequestInit = {
						body: JSON.stringify({ type, data: inputData }),
						headers: new UseActionHeaders({ withJwt }),
						method: "POST",
						signal: controller.signal
					}

					setIsPending(true)
					const response = await fetch(endpoint, options)

					if (response.ok) {
						const responseOutput = await response.json()
						if (isDev)
							console.info(
								"use-action",
								type,
								inputData,
								responseOutput.data
							)
						setData(responseOutput.data)
					} else if (response.status === __400__BAD_REQUEST__) {
						const responseOutput = await response.json()
						console.error(
							"use-action",
							type,
							inputData,
							responseOutput.error
						)
						setError(responseOutput.error)
					} else {
						console.error("use-action", type, response.status)
						throw response.status
					}
				} catch (error) {
					switch (true) {
						case error instanceof DOMException &&
							error.name === "AbortError": {
							// This AbortError is called on component unmount.
							break
						}

						case controller.signal.aborted: {
							setError({ name: "Timeout" })
							break
						}

						case error === __400__BAD_REQUEST__: {
							setError({ name: BadRequestError.errorName })
							break
						}

						case error === __401__UNAUTHORIZED__: {
							setError({ name: UnauthorizedError.errorName })
							break
						}

						case error === __404__NOT_FOUND__: {
							setError({ name: NotFoundError.errorName })
							break
						}

						case error === __500__INTERNAL_SERVER_ERROR__: {
							setError({ name: InternalServerError.name })
							break
						}

						case error === __502__BAD_GATEWAY__: {
							setError({ name: BadGatewayError.name })
							break
						}

						default: {
							console.error(error)
							setError({ name: "GenericError" })
						}
					}
				} finally {
					controller.clearTimeout()
					setIsPending(false)
				}
			})()
		},
		[endpoint, type, withJwt]
	)

	const isDone = data !== undefined
	const hasError = error !== undefined
	const canRun = [hasError, isDone, isPending].every((item) => !item)

	return {
		canRun,
		data,
		error,
		hasError,
		isDone,
		isPending,
		request,
		reset
	}
}