import { defaultLanguage, Language, languages } from "@ggbot2/models"

export type Locale = Language

export const defaultLocale: Locale = defaultLanguage

export const detectLocale = (): Locale => {
	for (const language of languages)
		if (window.navigator.language.startsWith(language)) return language
	return defaultLocale
}

export const localeJsonPathname = (locale: Locale) =>
	`/translations/${locale}.json`
