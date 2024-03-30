import { defaultLanguage, Language, languages } from "@workspace/models"

export const detectLanguage = (): Language => {
	for (const language of languages)
		if (navigator.language.startsWith(language)) return language
	return defaultLanguage
}

export const translationPathname = (language: Language) =>
	`/translations/${language}.json`
