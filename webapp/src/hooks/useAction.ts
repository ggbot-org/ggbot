import { AuthenticationContext } from "_/contexts/Authentication"
import { ToastContext } from "_/contexts/Toast"
import { localWebStorage } from "_/storages/local"
import { ActionIO, ApiActionError, clientAction, ClientActionHeaders, GenericError, isApiActionOutputData, isApiActionOutputError, TimeoutError } from "@workspace/api"
import { BadGatewayError, BadRequestError, GatewayTimeoutError, InternalServerError, UnauthorizedError } from "@workspace/http"
import { logging } from "@workspace/logging"
import { useCallback, useContext, useState } from "react"
import { useIntl } from "react-intl"

const { debug, warn } = logging("use-action")

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
export function useAction<ActionType extends string, Input extends ActionIO, Output extends ActionIO >(
	{ url, withAuth }: UseActionApiArg,
	type: ActionType
) {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)
	const { exit } = useContext(AuthenticationContext)

	const [data, setData] = useState<Output | undefined>()
	const [error, setError] = useState<ApiActionError | undefined>()
	const [isPending, setIsPending] = useState<boolean | undefined>()

	const genericError = formatMessage({ id: "GenericError.message" })

	const reset = useCallback(() => {
		setData(undefined)
		setError(undefined)
		setIsPending(undefined)
	}, [])

	const request = useCallback(
		(inputData?: Input) => {
			(async function () {
				try {
					const headers = new ClientActionHeaders()
					if (withAuth) {
						const token = localWebStorage.authToken.get()
						if (token) headers.appendAuthorization(token)
						else throw new UnauthorizedError()
					}

					setIsPending(true)
					const output = await clientAction(url, headers, { type, data: inputData })

					if (isApiActionOutputData(output)) {
						const { data: outputData } = output
						setData(outputData as Output)
					}

					if (isApiActionOutputError(output)) {
						const { error } = output
						warn(type, JSON.stringify(inputData), JSON.stringify(error))
						setError(error)
					}
				} catch (error) {
					// This AbortError is called on component unmount.
					if (error instanceof DOMException && error.name === "AbortError") return

					debug(error)

					if (error instanceof GatewayTimeoutError) {
						toast.warning(genericError)
						return setError({ name: GatewayTimeoutError.errorName })
					}

					if (error instanceof TimeoutError) {
						toast.warning(genericError)
						return setError({ name: TimeoutError.errorName })
					}

					if (error instanceof BadRequestError) {
						toast.warning(genericError)
						return setError({ name: BadRequestError.errorName })
					}

					if (error instanceof UnauthorizedError) {
						exit()
						return setError({ name: UnauthorizedError.errorName })
					}

					if (error instanceof InternalServerError) {
						toast.warning(genericError)
						return setError({ name: InternalServerError.name })
					}

					// TODO in case of test Binance error a toast and the proxy is down
					// the toast should say contact support.
					if (error instanceof BadGatewayError) return setError({ name: BadGatewayError.name })

					setError({ name: GenericError.errorName })
				} finally {
					setIsPending(false)
				}
			})().catch((error) => {
				debug(error)
				setError({ name: GenericError.errorName })
			})
		},
		[exit, url, type, withAuth, toast, genericError]
	)

	const isDone = data !== undefined
	const hasError = error !== undefined
	const canRun = [hasError, isDone, isPending].every((item) => !item)

	return { canRun, data, error, hasError, isDone, isPending, request, reset }
}
