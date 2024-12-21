import { defaultLanguage, languages } from '@workspace/models'

/** @typedef {import('@workspace/models').Language} Language */

/** @returns {Language} language */
export function detectLanguage() {
	for (const language of languages) {
		if (navigator.language.startsWith(language)) return language
	}
	return defaultLanguage
}

/** @param {Language} language */
export function translationPathname(language) {
	return `/translations/${language}.json`
}
