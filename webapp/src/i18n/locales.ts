import { Language } from "@workspace/models"

export function translationPathname(language: Language) {
	return `/translations/${language}.json`
}
