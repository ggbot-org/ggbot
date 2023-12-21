import { AuthEnter, AuthEnterProps } from "_/components/authentication/Enter"
import { AuthExit, AuthExitProps } from "_/components/authentication/Exit"
import { AuthVerify, AuthVerifyProps } from "_/components/authentication/Verify"
import { Navigation } from "_/components/Navigation"
import { useUserApi } from "_/hooks/useUserApi"
import { logging } from "_/logging"
import { href } from "_/routing/public/hrefs"
import { clearStorages } from "_/storages/clearStorages"
import { localWebStorage } from "_/storages/local"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
import { AccountInfo, EmailAddress, Subscription } from "@workspace/models"
import { now, Time } from "minimal-time-helpers"
import {
	createContext,
	FC,
	PropsWithChildren,
	Reducer,
	useCallback,
	useEffect,
	useMemo,
	useReducer
} from "react"

type State = {
	email: EmailAddress | undefined
	exitIsActive: boolean
	exited: boolean
	token: string | undefined
	verified?: boolean | undefined
	startSession: Time
}

type Action =
	| { type: "EXIT" }
	| { type: "SET_EMAIL"; data: Pick<State, "email"> }
	| {
			type: "SET_EXIT_IS_ACTIVE"
			data: Pick<State, "exitIsActive">
	  }
	| {
			type: "SET_TOKEN"
			data: NonNullable<Pick<State, "token">>
	  }
	| { type: "RESET_TOKEN" }

type ContextValue = {
	account: AccountInfo | null | undefined
	accountId: string
	accountEmail: string
	subscription: Subscription | null | undefined
	showAuthExit: () => void
}

const { info } = logging("authentication")

export const AuthenticationContext = createContext<ContextValue>({
	account: undefined,
	accountId: "",
	accountEmail: "",
	subscription: undefined,
	showAuthExit: () => {}
})

AuthenticationContext.displayName = "AuthenticationContext"

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const [{ email, exited, exitIsActive, startSession, token }, dispatch] =
		useReducer<Reducer<State, Action>>(
			(state, action) => {
				info("AuthenticationProvider", JSON.stringify(action, null, 2))

				if (action.type === "EXIT") {
					clearStorages()
					return { ...state, exited: true, exitIsActive: false }
				}

				if (action.type === "RESET_TOKEN") {
					localWebStorage.authToken.delete()
					return {
						...state,
						// Need also to reset `email` together with `token`.
						email: undefined,
						token: undefined
					}
				}

				if (action.type === "SET_EMAIL") {
					const { email } = action.data
					return { ...state, email }
				}

				if (action.type === "SET_EXIT_IS_ACTIVE") {
					const { exitIsActive } = action.data
					return { ...state, exitIsActive }
				}

				if (action.type === "SET_TOKEN") {
					const { token } = action.data
					localWebStorage.authToken.set(token)
					return {
						...state,
						// Need also to reset `email` whenever `token` changes.
						email: undefined,
						token
					}
				}

				return state
			},
			{
				email: undefined,
				exited: false,
				exitIsActive: false,
				token: localWebStorage.authToken.get(),
				startSession: now()
			}
		)

	const READ = useUserApi.ReadAccountInfo()
	const account = READ.data

	const setToken = useCallback<AuthVerifyProps["setToken"]>(
		(token) => {
			READ.reset()
			dispatch({ type: "SET_TOKEN", data: { token } })
		},
		[dispatch, READ]
	)

	const setEmail = useCallback<AuthEnterProps["setEmail"]>((email) => {
		dispatch({ type: "SET_EMAIL", data: { email } })
	}, [])

	const resetEmail = useCallback<AuthVerifyProps["resetEmail"]>(() => {
		dispatch({ type: "SET_EMAIL", data: { email: undefined } })
	}, [])

	const exit = useCallback<AuthExitProps["exit"]>(() => {
		dispatch({ type: "EXIT" })
	}, [])

	const setExitIsActive = useCallback<AuthExitProps["setIsActive"]>(
		(exitIsActive) => {
			dispatch({ type: "SET_EXIT_IS_ACTIVE", data: { exitIsActive } })
		},
		[]
	)

	// Handle case when `authToken` is deleted from localWebStorage in other tabs.
	const onLocalStorageChange = useCallback(() => {
		if (!token) return
		const authToken = localWebStorage.authToken.get()
		if (!authToken) exit()
	}, [token, exit])

	const contextValue = useMemo<ContextValue>(
		() => ({
			...(account
				? {
						account,
						accountId: account.id,
						accountEmail: account.email,
						subscription: account.subscription
				  }
				: {
						account,
						accountId: "",
						accountEmail: "",
						subscription: undefined
				  }),
			exit,
			showAuthExit: () => {
				dispatch({
					type: "SET_EXIT_IS_ACTIVE",
					data: { exitIsActive: true }
				})
			}
		}),
		[account, exit]
	)

	// Fetch account info.
	useEffect(() => {
		if (token === undefined) return
		if (READ.canRun) READ.request()
	}, [READ, token])

	// Handle errors.
	useEffect(() => {
		if (READ.error) {
			if (READ.error.name === UnauthorizedError.errorName)
				if (token) dispatch({ type: "RESET_TOKEN" })

			if (READ.error.name === BadGatewayError.errorName) {
				// Re-fetch.
				const timeoutId = window.setTimeout(() => {
					READ.reset()
				}, 5000)
				return () => {
					window.clearTimeout(timeoutId)
				}
			}
		}
	}, [READ, dispatch, token])

	useEffect(() => {
		if (account === undefined) return

		if (account === null) {
			dispatch({ type: "SET_EMAIL", data: { email: undefined } })
			return
		}

		dispatch({ type: "SET_EMAIL", data: { email: account.email } })
	}, [account, startSession])

	// Go to Homepage on exit.
	useEffect(() => {
		if (exited) window.location.href = href.homePage()
	}, [exited])

	useEffect(() => {
		localWebStorage.addEventListener("authTokenDeleted", exit)
		return () => {
			localWebStorage.removeEventListener("authTokenDeleted", exit)
		}
	}, [exit])

	useEffect(() => {
		window.addEventListener("storage", onLocalStorageChange)
		return () => {
			window.removeEventListener("storage", onLocalStorageChange)
		}
	}, [onLocalStorageChange])

	if (account === null || token === undefined) {
		if (email) {
			return (
				<AuthVerify
					email={email}
					setToken={setToken}
					resetEmail={resetEmail}
				/>
			)
		} else {
			return <AuthEnter setEmail={setEmail} />
		}
	}

	if (account === undefined) return <Navigation />

	return (
		<AuthenticationContext.Provider value={contextValue}>
			{children}

			<AuthExit
				isActive={exitIsActive}
				setIsActive={setExitIsActive}
				exit={exit}
			/>
		</AuthenticationContext.Provider>
	)
}
