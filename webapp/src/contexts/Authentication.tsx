import { AuthEnter, AuthEnterProps } from "_/components/authentication/Enter"
import { AuthExit } from "_/components/authentication/Exit"
import { AuthVerify, AuthVerifyProps } from "_/components/authentication/Verify"
import { Columns, OneColumn, Page } from "_/components/library"
import { Navigation } from "_/components/public/Navigation"
import { useReadAccountInfo } from "_/hooks/user/api"
import { clearStorages } from "_/storages/clearStorages"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
import { AccountInfo, EmailAddress, Subscription } from "@workspace/models"
import { Time } from "minimal-time-helpers"
import { createContext, PropsWithChildren, Reducer, useCallback, useEffect, useMemo, useReducer, useState } from "react"

type State = {
	email: EmailAddress | undefined
	exitConfirmationIsActive: boolean
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
	exit: () => void
	subscription: Subscription | null | undefined
	showAuthExit: () => void
}

export const AuthenticationContext = createContext<ContextValue>({
	accountId: "",
	accountEmail: "",
	accountIsAdmin: undefined,
	accountWhenCreated: undefined,
	exit: () => { /* do nothing */ },
	subscription: undefined,
	showAuthExit: () => { /* do nothing */ }
})

AuthenticationContext.displayName = "AuthenticationContext"

export function AuthenticationProvider({ children }: PropsWithChildren) {
	const [{ email, exitConfirmationIsActive, token }, dispatch] = useReducer<Reducer<State, Action>>((state, action) => {
		if (action.type === "EXIT") return {
			email: undefined,
			exitConfirmationIsActive: false,
			token: undefined
		}

		if (action.type === "RESET_TOKEN") return {
			...state,
			// Need to reset `email` together with `token`.
			email: undefined,
			token: undefined
		}

		if (action.type === "SET_EMAIL") return { ...state, email: action.data.email }

		if (action.type === "SET_EXIT_CONFIRMATION_IS_ACTIVE") return {
			...state,
			exitConfirmationIsActive:
						action.data.exitConfirmationIsActive
		}

		if (action.type === "SET_TOKEN") return {
			...state,
			// Need also to reset `email` whenever `token` changes.
			email: undefined,
			token: action.data.token
		}

		return state
	},
	{
		email: undefined,
		exitConfirmationIsActive: false,
		token: localWebStorage.authToken.get()
	})

	const [storedAccountInfo, setStoredAccountInfo] = useState<AccountInfo | undefined>(sessionWebStorage.accountInfo.get())

	const READ = useReadAccountInfo()
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
		dispatch({ type: "SET_EXIT_CONFIRMATION_IS_ACTIVE", data: { exitConfirmationIsActive: true } })
	}, [])

	const onLocalStorageChange = useCallback(() => {
		// Handle case when `accountInfo` changes or is deleted from localWebStorage in other tabs.
		setStoredAccountInfo(sessionWebStorage.accountInfo.get())
		// Handle case when `authToken` is deleted from localWebStorage in other tabs.
		if (!token) return
		const authToken = localWebStorage.authToken.get()
		if (!authToken) exit()
	}, [token, exit])

	const contextValue = useMemo<ContextValue>(
		() => ({
			accountId: storedAccountInfo?.id ?? "",
			accountIsAdmin: storedAccountInfo?.role === "admin",
			accountEmail: storedAccountInfo?.email ?? "",
			accountWhenCreated: storedAccountInfo?.whenCreated,
			exit,
			subscription: storedAccountInfo?.subscription,
			showAuthExit
		}),
		[exit, showAuthExit, storedAccountInfo]
	)

	// Fetch account info.
	useEffect(() => {
		if (token === undefined) return
		if (storedAccountInfo) return
		if (READ.canRun) READ.request()
	}, [READ, storedAccountInfo, token])

	// Store account info in session storage.
	useEffect(() => {
		if (!accountInfo) return
		sessionWebStorage.accountInfo.set(accountInfo)
		setStoredAccountInfo(accountInfo)
	}, [accountInfo])

	// Handle errors.
	useEffect(() => {
		if (READ.error) {
			if (READ.error.name === UnauthorizedError.errorName) {
				if (token) {
					localWebStorage.authToken.delete()
					dispatch({ type: "RESET_TOKEN" })
				}
			}

			if (READ.error.name === BadGatewayError.errorName) {
				// Re-fetch.
				const timeoutId = setTimeout(() => READ.reset(), 5_000)
				return () => clearTimeout(timeoutId)
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

	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => removeEventListener("storage", onLocalStorageChange)
	}, [onLocalStorageChange])

	if (accountInfo === null || token === undefined) {
		return (
			<Page header={<Navigation />}>
				<Columns>
					<OneColumn>
						{email ? (
							<AuthVerify email={email} resetEmail={resetEmail} setToken={setToken} />
						) : (
							<AuthEnter setEmail={setEmail} />
						)}
					</OneColumn>
				</Columns>
			</Page>
		)
	}

	return (
		<AuthenticationContext.Provider value={contextValue}>
			{children}
			<AuthExit
				accountEmail={contextValue.accountEmail}
				accountId={contextValue.accountId}
				exit={exit}
				isActive={exitConfirmationIsActive}
				setIsActive={(exitConfirmationIsActive) => {
					dispatch({ type: "SET_EXIT_CONFIRMATION_IS_ACTIVE", data: { exitConfirmationIsActive } })
				}}
			/>
		</AuthenticationContext.Provider>
	)
}
