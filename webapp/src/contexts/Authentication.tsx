import { isDev } from "@ggbot2/env"
import { Account, EmailAddress, noneAccount } from "@ggbot2/models"
import { NonEmptyString } from "@ggbot2/type-utils"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
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

import {
	AuthEnter,
	AuthEnterProps
} from "../components/authentication/Enter.js"
import { AuthExit, AuthExitProps } from "../components/authentication/Exit.js"
import {
	AuthVerify,
	AuthVerifyProps
} from "../components/authentication/Verify.js"
import { Navigation } from "../components/Navigation.js"
import { useUserApi } from "../hooks/useUserApi.js"
import { localWebStorage } from "../storages/local.js"
import { sessionWebStorage } from "../storages/session.js"

type State = {
	email: EmailAddress | undefined
	exitIsActive: boolean
	exited: boolean
	jwt: NonEmptyString | undefined
	verified?: boolean | undefined
	startSession: Time
}

type ContextValue = {
	account: Account
	showAuthExit: () => void
}

export const AuthenticationContext = createContext<ContextValue>({
	account: noneAccount,
	showAuthExit: () => {}
})

AuthenticationContext.displayName = "AuthenticationContext"

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const [{ email, exited, exitIsActive, jwt, startSession }, dispatch] =
		useReducer<
			Reducer<
				State,
				| { type: "EXIT" }
				| { type: "SET_EMAIL"; data: Pick<State, "email"> }
				| {
						type: "SET_EXIT_IS_ACTIVE"
						data: Pick<State, "exitIsActive">
				  }
				| {
						type: "SET_JWT"
						data: NonNullable<Pick<State, "jwt">>
				  }
				| { type: "RESET_JWT" }
			>
		>(
			(state, action) => {
				if (isDev)
					console.info(
						"Authentication",
						JSON.stringify(action, null, 2)
					)
				switch (action.type) {
					case "EXIT": {
						localWebStorage.clear()
						sessionWebStorage.clear()
						return { ...state, exited: true, exitIsActive: false }
					}

					case "RESET_JWT": {
						localWebStorage.jwt.delete()
						return {
							...state,
							// Need also to reset email togetcher with jwt.
							email: undefined,
							jwt: undefined
						}
					}

					case "SET_EMAIL": {
						const { email } = action.data
						return { ...state, email }
					}

					case "SET_EXIT_IS_ACTIVE": {
						const { exitIsActive } = action.data
						return { ...state, exitIsActive }
					}

					case "SET_JWT": {
						const { jwt } = action.data
						localWebStorage.jwt.set(jwt)
						return {
							...state,
							// Need also to reset email whenever jwt changes.
							email: undefined,
							jwt
						}
					}

					default:
						return state
				}
			},
			{
				email: undefined,
				exited: false,
				exitIsActive: false,
				jwt: localWebStorage.jwt.get(),
				startSession: now()
			}
		)

	const READ = useUserApi.ReadAccount()
	const account = READ.data

	const setJwt = useCallback<AuthVerifyProps["setJwt"]>(
		(jwt) => {
			READ.reset()
			dispatch({ type: "SET_JWT", data: { jwt } })
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

	const contextValue = useMemo<ContextValue>(
		() => ({
			account: account ?? noneAccount,
			exit: () => {
				dispatch({ type: "EXIT" })
			},
			showAuthExit: () => {
				dispatch({
					type: "SET_EXIT_IS_ACTIVE",
					data: { exitIsActive: true }
				})
			}
		}),
		[account]
	)

	// Fetch account.
	useEffect(() => {
		if (!jwt) return
		if (READ.canRun) READ.request()
	}, [READ, jwt])

	// Handle errors.
	useEffect(() => {
		if (READ.error) {
			if (READ.error.name === UnauthorizedError.errorName) {
				if (jwt) dispatch({ type: "RESET_JWT" })
			}

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
	}, [READ, dispatch, jwt])

	useEffect(() => {
		if (account === undefined) return

		if (account === null) {
			dispatch({ type: "SET_EMAIL", data: { email: undefined } })
			return
		}

		dispatch({ type: "SET_EMAIL", data: { email: account.email } })
	}, [account, startSession])

	// Refresh page on exit.
	useEffect(() => {
		if (exited) window.location.reload()
	}, [exited])

	if (account === null || jwt === undefined) {
		if (email) {
			return (
				<AuthVerify
					email={email}
					setJwt={setJwt}
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