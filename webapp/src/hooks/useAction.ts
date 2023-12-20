import { logging } from "_/logging"
import { localWebStorage } from "_/storages/local"
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
import { AccountKey, EmptyObject } from "@workspace/models"
import { useCallback, useState } from "react"

const { info, warn } = logging("use-action")

type ActionHeadersConstructorArg = {
	withAuth?: boolean
}

class ActionHeaders extends Headers {
	constructor({ withAuth }: ActionHeadersConstructorArg) {
		super({
			Accept: "application/json",
			"Content-Type": "application/json"
		})
		if (withAuth)
			this.append(
				"Authorization",
				`Bearer ${localWebStorage.authToken.get()}`
			)
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

export type UseActionApiArg = { endpoint: string } & ActionHeadersConstructorArg

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
					const options: RequestInit = {
						body: JSON.stringify({ type, data: inputData }),
						headers: new ActionHeaders({ withAuth }),
						method: "POST",
						signal: controller.signal
					}

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
					} else if (response.status === __400__BAD_REQUEST__) {
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
					if (error === __400__BAD_REQUEST__)
						return setError({ name: BadRequestError.errorName })

					// TODO should logout user
					if (error === __401__UNAUTHORIZED__) {
						localWebStorage.authToken.delete()
						return setError({ name: UnauthorizedError.errorName })
					}

					// TODO consider using a toast to display: Something went wrong
					if (error === __404__NOT_FOUND__)
						return setError({ name: NotFoundError.errorName })

					// TODO consider using a toast to display: Something went wrong
					if (error === __500__INTERNAL_SERVER_ERROR__)
						return setError({ name: InternalServerError.name })

					if (error === __502__BAD_GATEWAY__)
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
		[endpoint, type, withAuth]
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

/**
 * Helper to create an operation where authentication context is provided
 * implicitly.
 */
export type Authenticated<
	Operation extends (...args: any[]) => Promise<unknown>
> = Omit<Parameters<Operation>[0], "accountId"> extends EmptyObject
	? (arg: void) => Promise<Awaited<ReturnType<Operation>>>
	: Parameters<Operation>[0] extends AccountKey
	? (
			arg: Omit<Parameters<Operation>[0], "accountId">
	  ) => Promise<Awaited<ReturnType<Operation>>>
	: never
