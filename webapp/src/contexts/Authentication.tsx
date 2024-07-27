import { AuthEnter, AuthEnterProps } from "_/components/authentication/Enter"
import { AuthExit } from "_/components/authentication/Exit"
import { AuthVerify, AuthVerifyProps } from "_/components/authentication/Verify"
import { useUserApi } from "_/hooks/useUserApi"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { clearStorages } from "_/storages/clearStorages"
import { localWebStorage } from "_/storages/local"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
import { Account, EmailAddress, Subscription } from "@workspace/models"
import { Time } from "minimal-time-helpers"
import {
	createContext,
	PropsWithChildren,
	Reducer,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState
} from "react"

type State = {
	email: EmailAddress | undefined
	exitConfirmationIsActive: boolean
	exited: boolean
	token: string | undefined
	verified?: boolean | undefined
}

type Action =
	| { type: "EXIT" }
	| { type: "SET_EMAIL"; data: Pick<State, "email"> }
	| {
			type: "SET_EXIT_CONFIRMATION_IS_ACTIVE"
			data: Pick<State, "exitConfirmationIsActive">
	  }
	| {
			type: "SET_TOKEN"
			data: NonNullable<Pick<State, "token">>
	  }
	| { type: "RESET_TOKEN" }

type ContextValue = {
	accountId: string
	accountEmail: string
	accountIsAdmin: boolean | undefined
	accountWhenCreated: Time | undefined
	subscription: Subscription | null | undefined
	showAuthExit: () => void
}

export const AuthenticationContext = createContext<ContextValue>({
	accountId: "",
	accountEmail: "",
	accountIsAdmin: undefined,
	accountWhenCreated: undefined,
	subscription: undefined,
	showAuthExit: () => {}
})

AuthenticationContext.displayName = "AuthenticationContext"

export function AuthenticationProvider({ children }: PropsWithChildren) {
	const [{ email, exited, exitConfirmationIsActive, token }, dispatch] =
		useReducer<Reducer<State, Action>>(
			(state, action) => {
				if (action.type === "EXIT")
					return {
						...state,
						exited: true,
						exitConfirmationIsActive: false
					}

				if (action.type === "RESET_TOKEN")
					return {
						...state,
						// Need to reset `email` together with `token`.
						email: undefined,
						token: undefined
					}

				if (action.type === "SET_EMAIL")
					return { ...state, email: action.data.email }

				if (action.type === "SET_EXIT_CONFIRMATION_IS_ACTIVE")
					return {
						...state,
						exitConfirmationIsActive:
							action.data.exitConfirmationIsActive
					}

				if (action.type === "SET_TOKEN")
					return {
						...state,
						// Need also to reset `email` whenever `token` changes.
						email: undefined,
						token: action.data.token
					}

				return state
			},
			{
				email: undefined,
				exited: false,
				exitConfirmationIsActive: false,
				token: localWebStorage.authToken.get()
			}
		)

	const [storedAccount, setStoredAccount] = useState<Account | undefined>(
		localWebStorage.account.get()
	)

	const READ = useUserApi.ReadAccountInfo()
	const accountInfo = READ.data

	const setToken = useCallback<AuthVerifyProps["setToken"]>(
		(token) => {
			READ.reset()
			localWebStorage.authToken.set(token)
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

	const exit = useCallback(() => {
		clearStorages()
		dispatch({ type: "EXIT" })
	}, [])

	const showAuthExit = useCallback<ContextValue["showAuthExit"]>(() => {
		dispatch({
			type: "SET_EXIT_CONFIRMATION_IS_ACTIVE",
			data: { exitConfirmationIsActive: true }
		})
	}, [])

	// Handle case when `authToken` is deleted from localWebStorage in other tabs.
	const onLocalStorageChange = useCallback(() => {
		if (!token) return
		const authToken = localWebStorage.authToken.get()
		if (!authToken) exit()
	}, [token, exit])

	// TODO improve this
	// Authentication context may work differently, and do not provide subscription
	// also subscription could be cached in session storage?
	const contextValue = useMemo<ContextValue>(
		() => ({
			accountId: storedAccount?.id ?? "",
			accountIsAdmin: storedAccount?.role === "admin",
			accountEmail: storedAccount?.email ?? "",
			accountWhenCreated: storedAccount?.whenCreated,
			subscription: accountInfo?.subscription,
			showAuthExit
		}),
		[accountInfo, showAuthExit, storedAccount]
	)

	// Fetch account info.
	useEffect(() => {
		if (token === undefined) return
		if (READ.canRun) READ.request()
	}, [READ, accountInfo, token])

	// Store account in local storage.
	useEffect(() => {
		if (!accountInfo) return
		const { subscription: _remove, ...account } = accountInfo
		localWebStorage.account.set(account)
		setStoredAccount(account)
	}, [accountInfo])

	// Handle errors.
	useEffect(() => {
		if (READ.error) {
			if (READ.error.name === UnauthorizedError.errorName)
				if (token) {
					localWebStorage.authToken.delete()
					dispatch({ type: "RESET_TOKEN" })
				}

			if (READ.error.name === BadGatewayError.errorName) {
				// Re-fetch.
				const timeoutId = setTimeout(() => {
					READ.reset()
				}, 5_000)
				return () => {
					clearTimeout(timeoutId)
				}
			}
		}
	}, [READ, dispatch, token])

	useEffect(() => {
		if (accountInfo === undefined) return

		if (accountInfo === null) {
			dispatch({ type: "SET_EMAIL", data: { email: undefined } })
			return
		}

		dispatch({ type: "SET_EMAIL", data: { email: accountInfo.email } })
	}, [accountInfo])

	// Go to Homepage on exit.
	useEffect(() => {
		if (exited) GOTO(webapp.homepage)
	}, [exited])

	useEffect(() => {
		localWebStorage.addEventListener("authTokenDeleted", exit)
		return () => {
			localWebStorage.removeEventListener("authTokenDeleted", exit)
		}
	}, [exit])

	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => {
			removeEventListener("storage", onLocalStorageChange)
		}
	}, [onLocalStorageChange])

	if (accountInfo === null || token === undefined)
		return email ? (
			<AuthVerify
				email={email}
				setToken={setToken}
				resetEmail={resetEmail}
			/>
		) : (
			<AuthEnter setEmail={setEmail} />
		)

	return (
		<AuthenticationContext.Provider value={contextValue}>
			{children}

			<AuthExit
				isActive={exitConfirmationIsActive}
				setIsActive={(exitConfirmationIsActive) => {
					dispatch({
						type: "SET_EXIT_CONFIRMATION_IS_ACTIVE",
						data: { exitConfirmationIsActive }
					})
				}}
				exit={exit}
			/>
		</AuthenticationContext.Provider>
	)
}
