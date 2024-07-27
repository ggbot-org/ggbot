import { localWebStorage } from "_/storages/local"
import {
	ActionIO,
	ApiActionClientSideError,
	ApiActionServerSideError,
	clientAction,
	ClientActionHeaders,
	GenericError,
	isApiActionOutputData,
	isApiActionOutputError,
	TimeoutError
} from "@workspace/api"
import {
	BadGatewayError,
	BadRequestError,
	GatewayTimeoutError,
	InternalServerError,
	UnauthorizedError
} from "@workspace/http"
import { logging } from "@workspace/logging"
import { useCallback, useState } from "react"

const { debug, warn } = logging("use-action")

export type UseActionError =
	| ApiActionClientSideError
	| ApiActionServerSideError
	| undefined

export type UseActionApiArg = {
	url: Parameters<typeof clientAction>[0]
	withAuth?: boolean
}

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
 * type ActionType = "FooBar"
 * type Input = {
 * 	param: string
 * }
 * type Operation = (arg: Input) => Promise<void>
 *
 * export const FooBar = useAction<Operation, ActionType>(
 * 	{ url: "http://api.example.com/action" },
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
export function useAction<
	ActionType extends string,
	Input extends ActionIO,
	Output extends ActionIO
>({ url, withAuth }: UseActionApiArg, type: ActionType) {
	const [data, setData] = useState<Output | undefined>()
	const [error, setError] = useState<UseActionError>()
	const [isPending, setIsPending] = useState<boolean | undefined>()

	const reset = useCallback(() => {
		setData(undefined)
		setError(undefined)
		setIsPending(undefined)
	}, [])

	const request = useCallback(
		(inputData?: Input) => {
			;(async function () {
				try {
					const headers = new ClientActionHeaders()
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

					setIsPending(true)
					const output = await clientAction(url, headers, {
						type,
						data: inputData
					})

					if (isApiActionOutputData(output)) {
						const { data: outputData } = output
						setData(outputData as Output)
					}

					if (isApiActionOutputError(output)) {
						const { error } = output
						warn(
							type,
							JSON.stringify(inputData),
							JSON.stringify(error)
						)
						setError(error)
					}
				} catch (error) {
					// This AbortError is called on component unmount.
					if (
						error instanceof DOMException &&
						error.name === "AbortError"
					)
						return

					if (error instanceof GatewayTimeoutError)
						return setError({ name: GatewayTimeoutError.errorName })

					if (error instanceof TimeoutError)
						return setError({ name: TimeoutError.errorName })

					// TODO consider using a toast to display: Something went wrong
					if (error instanceof BadRequestError)
						return setError({ name: BadRequestError.errorName })

					if (error instanceof UnauthorizedError) {
						localWebStorage.authToken.delete()
						return setError({ name: UnauthorizedError.errorName })
					}

					// TODO consider using a toast to display: Something went wrong
					if (error instanceof InternalServerError)
						return setError({ name: InternalServerError.name })

					// TODO in case of test Binance error a toast and the proxy is down
					// the toast should say contact support.
					if (error instanceof BadGatewayError)
						return setError({ name: BadGatewayError.name })

					debug(error)
					setError({ name: GenericError.errorName })
				} finally {
					setIsPending(false)
				}
			})().catch((error) => {
				debug(error)
				setError({ name: GenericError.errorName })
			})
		},
		[url, type, withAuth]
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
