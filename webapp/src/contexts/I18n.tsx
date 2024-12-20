import { Navbar } from '_/components/library'
import { detectLanguage, translationPathname } from '_/i18n/languages'
import { I18nMessagesRecord } from '_/i18n/messages'
import { defaultLanguage, Language } from '@workspace/models'
import { createContext, PropsWithChildren, useEffect, useMemo, useReducer } from 'react'

type ContextValue = {
	language: Language
	messages?: I18nMessagesRecord
}

export const I18nContext = createContext<ContextValue>({
	language: defaultLanguage,
})

type State = {
	messages?: I18nMessagesRecord
	readIsPending: boolean
	readHasError: boolean
}

type Action =
	| { type: 'READ_INTL_MESSAGES_REQUEST' }
	| { type: 'READ_INTL_MESSAGES_FAILURE' }
	| {
		type: 'READ_INTL_MESSAGES_SUCCESS'
		messages: I18nMessagesRecord
	}

export function I18nProvider({ children }: PropsWithChildren) {
	const [{ messages, readHasError, readIsPending }, dispatch] = useReducer<
		State, [any]
	>((state, action: Action) => {
		if (action.type == 'READ_INTL_MESSAGES_REQUEST') return {
			readHasError: false,
			readIsPending: true,
		}

		if (action.type == 'READ_INTL_MESSAGES_FAILURE') return {
			readHasError: true,
			readIsPending: false,
		}

		if (action.type == 'READ_INTL_MESSAGES_SUCCESS') return {
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
		// Get messages via HTTP.
		dispatch({ type: 'READ_INTL_MESSAGES_REQUEST' })
		fetch(translationPathname(language)).then((response) => response.json())
			.then((json) => dispatch({ type: 'READ_INTL_MESSAGES_SUCCESS', messages: json }))
			.catch((error) => {
				console.error(error)
				dispatch({ type: 'READ_INTL_MESSAGES_FAILURE' })
			})
	}, [language, messages, readHasError, readIsPending])

	const contextValue = useMemo<ContextValue>(() => ({
		language,
		messages,
	}), [language, messages])

	return (
		<I18nContext.Provider value={contextValue}>
			{!contextValue.messages ? (
				// Show app shell while translations are loading.
				<Navbar noMenu />
			) : (
				children
			)}
		</I18nContext.Provider>
	)
}
