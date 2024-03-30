import { join } from "node:path"

import {
	FormatjsIntlMessageIdsContent,
	FormatjsIntlMessageIdsFilename
} from "_/i18n/FormatjsIntlMessageIds.js"
import { translationPathname } from "_/i18n/locales.js"
import { defaultLanguage } from "@workspace/models"
import readFile from "read-file-utf8"
import writeFile from "write-file-utf8"

import { typesDir, workspaceDir } from "../package.js"

const defaultTranslation = await readFile(
	join(workspaceDir, translationPathname(defaultLanguage))
)

const pathname = join(typesDir, FormatjsIntlMessageIdsFilename)

const translationKeys = Object.keys(defaultTranslation)

const content = FormatjsIntlMessageIdsContent(translationKeys)

await writeFile(pathname, content)
