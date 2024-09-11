import { defaultLanguage, Language, languages } from "@workspace/models"

export function detectLanguage(): Language {
	for (const language of languages) {
		if (navigator.language.startsWith(language)) return language
	}
	return defaultLanguage
}

