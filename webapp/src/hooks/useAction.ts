import { logging } from "_/logging"
import { localWebStorage } from "_/storages/local"
import {
	ApiActionClientSideError,
	ApiActionHeaders,
	apiActionRequestInit,
	ApiActionServerSideError} from "@workspace/api"
import {
	BAD_GATEWAY__502,
	BAD_REQUEST__400,
	BadGatewayError,
	BadRequestError,
	INTERNAL_SERVER_ERROR__500,
	InternalServerError,
	NOT_FOUND__404,
	NotFoundError,
	UNAUTHORIZED__401,
	UnauthorizedError
} from "@workspace/http"
import { useCallback, useState } from "react"

const { info, warn } = logging("use-action")

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

export type UseActionApiArg = { endpoint: string; withAuth?: boolean }

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
 * type ActionType = "FooBar"
 * type Input = {
 * 	param: string
 * }
 * type Operation = (arg: Input) => Promise<void>
 *
 * export const FooBar = useAction<Operation, ActionType>(
 * 	{ endpoint },
 * 	"FooBar"
 * )
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
	Operation extends (...args: any[]) => Promise<unknown>,
	ActionType extends string
>(
	{ endpoint, withAuth }: UseActionApiArg,
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
			(async function () {
				const controller = new UseActionAbortController()

				try {
					const headers = new ApiActionHeaders()
					if (withAuth) {
						const token = localWebStorage.authToken.get()
						if (token) {
							headers.appendAuthorization(token)
						} else {
							return setError({
								name: UnauthorizedError.errorName
							})
						}
					}

					const options = apiActionRequestInit({
						type,
						data,
						headers,
						signal: controller.signal
					})

					setIsPending(true)
					const response = await fetch(endpoint, options)

					if (response.ok) {
						const { data: outputData } = await response.json()
						info(
							type,
							JSON.stringify(inputData),
							JSON.stringify(outputData)
						)
						setData(outputData)
					} else if (response.status === BAD_REQUEST__400) {
						const { error } = await response.json()
						warn(
							type,
							JSON.stringify(inputData),
							JSON.stringify(error)
						)
						setError(error)
					} else {
						warn(type, response.status)
						throw response.status
					}
				} catch (error) {
					// This AbortError is called on component unmount.
					if (
						error instanceof DOMException &&
						error.name === "AbortError"
					)
						return

					if (controller.signal.aborted)
						return setError({ name: "Timeout" })

					// TODO consider using a toast to display: Something went wrong
					if (error === BAD_REQUEST__400)
						return setError({ name: BadRequestError.errorName })

					// TODO should logout user
					if (error === UNAUTHORIZED__401) {
						localWebStorage.authToken.delete()
						return setError({ name: UnauthorizedError.errorName })
					}

					// TODO consider using a toast to display: Something went wrong
					if (error === NOT_FOUND__404)
						return setError({ name: NotFoundError.errorName })

					// TODO consider using a toast to display: Something went wrong
					if (error === INTERNAL_SERVER_ERROR__500)
						return setError({ name: InternalServerError.name })

					if (error === BAD_GATEWAY__502)
						return setError({ name: BadGatewayError.name })

					warn(error)
					setError({ name: "GenericError" })
				} finally {
					controller.clearTimeout()
					setIsPending(false)
				}
			})().catch((error) => {
				warn(error)
				setError({ name: "GenericError" })
			})
		},
		[data, endpoint, type, withAuth]
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
