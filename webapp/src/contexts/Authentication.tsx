import { AuthEnter, AuthEnterProps } from "_/components/authentication/Enter"
import { AuthExit, AuthExitProps } from "_/components/authentication/Exit"
import { AuthVerify, AuthVerifyProps } from "_/components/authentication/Verify"
import { useUserApi } from "_/hooks/useUserApi"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { clearStorages } from "_/storages/clearStorages"
import { localWebStorage } from "_/storages/local"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
import { EmailAddress, isAdminAccount, Subscription } from "@workspace/models"
import { Time } from "minimal-time-helpers"
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
	accountId: string
	accountIsAdmin: boolean | undefined
	accountEmail: string
	accountWhenCreated: Time | undefined
	subscription: Subscription | null | undefined
	showAuthExit: () => void
}

export const AuthenticationContext = createContext<ContextValue>({
	accountId: "",
	accountIsAdmin: undefined,
	accountEmail: "",
	accountWhenCreated: undefined,
	subscription: undefined,
	showAuthExit: () => {}
})

AuthenticationContext.displayName = "AuthenticationContext"

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const [{ email, exited, exitIsActive, token }, dispatch] = useReducer<
		Reducer<State, Action>
	>(
		(state, action) => {
			if (action.type === "EXIT")
				return { ...state, exited: true, exitIsActive: false }

			if (action.type === "RESET_TOKEN")
				return {
					...state,
					// Need also to reset `email` together with `token`.
					email: undefined,
					token: undefined
				}

			if (action.type === "SET_EMAIL")
				return { ...state, email: action.data.email }

			if (action.type === "SET_EXIT_IS_ACTIVE")
				return { ...state, exitIsActive: action.data.exitIsActive }

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
			exitIsActive: false,
			token: localWebStorage.authToken.get()
		}
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

	const exit = useCallback<AuthExitProps["exit"]>(() => {
		clearStorages()
		dispatch({ type: "EXIT" })
	}, [])

	const showAuthExit = useCallback<ContextValue["showAuthExit"]>(() => {
		dispatch({
			type: "SET_EXIT_IS_ACTIVE",
			data: { exitIsActive: true }
		})
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
			accountId: accountInfo?.id ?? "",
			accountIsAdmin: accountInfo
				? isAdminAccount(accountInfo)
				: undefined,
			accountEmail: accountInfo?.email ?? "",
			accountWhenCreated: accountInfo?.whenCreated,
			subscription: accountInfo?.subscription,
			exit,
			showAuthExit
		}),
		[accountInfo, exit, showAuthExit]
	)

	// Fetch account info.
	useEffect(() => {
		if (token === undefined) return
		if (READ.canRun) READ.request()
	}, [READ, accountInfo, token])

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
				}, 5000)
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
				isActive={exitIsActive}
				setIsActive={setExitIsActive}
				exit={exit}
			/>
		</AuthenticationContext.Provider>
	)
}
