import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import {
	FormatjsIntlMessageIdsContent,
	FormatjsIntlMessageIdsFilename
} from "../i18n/FormatjsIntlMessageIds.js"
import { defaultLocale, localeJsonPathname } from "../i18n/locales.js"
import { rootDir, typesDir } from "../package.js"

const defaultTranslation = await readFile(
	join(rootDir, localeJsonPathname(defaultLocale)),
	{ encoding: "utf8" }
)

const translation = JSON.parse(defaultTranslation)

const pathname = join(typesDir, FormatjsIntlMessageIdsFilename)

const translationKeys = Object.keys(translation)

const content = FormatjsIntlMessageIdsContent(translationKeys)

await writeFile(pathname, content, { encoding: "utf8" })
