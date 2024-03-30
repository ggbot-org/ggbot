import { detectLanguage, translationPathname } from "_/i18n/locales"
import { logging } from "@workspace/logging"
import { defaultLanguage } from "@workspace/models"
import {
	FC,
	PropsWithChildren,
	Reducer,
	useCallback,
	useEffect,
	useReducer,
	useRef
} from "react"
import { IntlProvider } from "react-intl"

const { debug } = logging("i18n")

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
	const [{ intlMessagesLoaded, readIntlMessagesIsPending }, dispatch] =
		useReducer<
			Reducer<
				{
					intlMessagesLoaded?: boolean | undefined
					readIntlMessagesIsPending?: boolean | undefined
				},
				| { type: "READ_INTL_MESSAGES_REQUEST" }
				| { type: "READ_INTL_MESSAGES_SUCCESS" }
				| { type: "READ_INTL_MESSAGES_FAILURE" }
			>
		>((state, action) => {
			if (action.type === "READ_INTL_MESSAGES_REQUEST")
				return {
					...state,
					readIntlMessagesIsPending: true
				}

			if (action.type === "READ_INTL_MESSAGES_SUCCESS")
				return {
					...state,
					intlMessagesLoaded: true,
					readIntlMessagesIsPending: false
				}

			if (action.type === "READ_INTL_MESSAGES_FAILURE")
				return {
					...state,
					intlMessagesLoaded: false,
					readIntlMessagesIsPending: false
				}

			return state
		}, {})

	const intlMessages = useRef()

	const language = detectLanguage()

	const readIntlMessages = useCallback(async () => {
		try {
			dispatch({ type: "READ_INTL_MESSAGES_REQUEST" })
			const response = await fetch(translationPathname(language))
			const json = await response.json()
			intlMessages.current = json
			dispatch({ type: "READ_INTL_MESSAGES_SUCCESS" })
		} catch (error) {
			debug(error)
			dispatch({ type: "READ_INTL_MESSAGES_FAILURE" })
		}
	}, [language])

	useEffect(() => {
		if (readIntlMessagesIsPending !== undefined) return
		if (intlMessagesLoaded) return
		readIntlMessages().catch(debug)
	}, [readIntlMessages, intlMessagesLoaded, readIntlMessagesIsPending])

	return intlMessagesLoaded ? (
		<IntlProvider
			locale={language}
			defaultLocale={defaultLanguage}
			messages={intlMessages.current}
		>
			{children}
		</IntlProvider>
	) : null
}
