import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import {
	defaultLocale,
	FormatjsIntlMessageIdsContent,
	FormatjsIntlMessageIdsFilename,
	localeJsonPathname
} from "@ggbot2/i18n"

import { rootDir, srcDir } from "../package.js"

const defaultTranslation = await readFile(
	join(rootDir, localeJsonPathname(defaultLocale)),
	{ encoding: "utf8" }
)

const translation = JSON.parse(defaultTranslation)

const pathname = join(srcDir, "i18n", FormatjsIntlMessageIdsFilename)

const translationKeys = Object.keys(translation)

const content = FormatjsIntlMessageIdsContent(translationKeys)

await writeFile(pathname, content, { encoding: "utf8" })
