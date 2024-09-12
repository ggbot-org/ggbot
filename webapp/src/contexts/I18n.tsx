import { detectLanguage, translationPathname } from "_/i18n/locales"
import { defaultLanguage } from "@workspace/models"
import { PropsWithChildren, Reducer, useEffect, useReducer } from "react"
import { IntlConfig, IntlProvider } from "react-intl"

export function I18nProvider({ children }: PropsWithChildren) {
	const [{ messages, readHasError, readIsPending }, dispatch] = useReducer<
		Reducer<Pick<IntlConfig, "messages"> & {
			readIsPending: boolean
			readHasError: boolean
		},
			| { type: "READ_INTL_MESSAGES_REQUEST" }
			| { type: "READ_INTL_MESSAGES_FAILURE" }
			| { type: "READ_INTL_MESSAGES_SUCCESS" } & Required<Pick<IntlConfig, "messages">>
		>
	>((state, action) => {
		if (action.type === "READ_INTL_MESSAGES_REQUEST") return {
			readHasError: false,
			readIsPending: true,
		}

		if (action.type === "READ_INTL_MESSAGES_FAILURE") return {
			readHasError: true,
			readIsPending: false,
		}

		if (action.type === "READ_INTL_MESSAGES_SUCCESS") return {
			readHasError: false,
			readIsPending: false,
			messages: action.messages,
		}

		return state
	}, {
		readIsPending: false,
		readHasError: false,
	})

	const language = detectLanguage()

	useEffect(() => {
		if (readHasError || readIsPending) return
		if (messages) return
		// read Intl messages
		dispatch({ type: "READ_INTL_MESSAGES_REQUEST" })
		fetch(translationPathname(language)).then((response) => response.json())
			.then((json) => dispatch({ type: "READ_INTL_MESSAGES_SUCCESS", messages: json }))
			.catch((error) => {
				console.debug(error)
				dispatch({ type: "READ_INTL_MESSAGES_FAILURE" })
			})
	}, [language, messages, readHasError, readIsPending])

	// TODO instead of a blank page should show something, like
	// if (!messages) return <Navbar noMenu/>
	if (!messages) return null

	return (
		<IntlProvider
			defaultLocale={defaultLanguage}
			locale={language}
			messages={messages}
		>
			{children}
		</IntlProvider>
	)
}
