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

import { defaultLocale, detectLocale, localeJsonPathname } from "./locales.js"

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
			switch (action.type) {
				case "READ_INTL_MESSAGES_REQUEST": {
					return {
						...state,
						readIntlMessagesIsPending: true
					}
				}
				case "READ_INTL_MESSAGES_SUCCESS": {
					return {
						...state,
						intlMessagesLoaded: true,
						readIntlMessagesIsPending: false
					}
				}
				case "READ_INTL_MESSAGES_FAILURE": {
					return {
						...state,
						intlMessagesLoaded: false,
						readIntlMessagesIsPending: false
					}
				}

				default:
					return state
			}
		}, {})

	const intlMessages = useRef()

	const locale = detectLocale()

	const readIntlMessages = useCallback(async () => {
		try {
			dispatch({ type: "READ_INTL_MESSAGES_REQUEST" })
			const pathname = localeJsonPathname(locale)
			const response = await fetch(pathname)
			const json = await response.json()
			intlMessages.current = json
			dispatch({ type: "READ_INTL_MESSAGES_SUCCESS" })
		} catch (error) {
			console.error(error)
			dispatch({ type: "READ_INTL_MESSAGES_FAILURE" })
		}
	}, [locale])

	useEffect(() => {
		if (readIntlMessagesIsPending !== undefined) return
		if (intlMessagesLoaded) return
		readIntlMessages()
	}, [readIntlMessages, intlMessagesLoaded, readIntlMessagesIsPending])

	return intlMessagesLoaded ? (
		<IntlProvider
			locale={locale}
			defaultLocale={defaultLocale}
			messages={intlMessages.current}
		>
			{children}
		</IntlProvider>
	) : null
}
