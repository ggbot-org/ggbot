import { join } from 'node:path'

import { translationPathname } from '_/i18n/languages.js'
import { defaultLanguage } from '@workspace/models'
import readFile from 'read-file-utf8'
import writeFile from 'write-file-utf8'

import { typesDir, workspaceDir } from '../package.js'

const FormatjsIntlMessageIdsFilename = 'FormatjsIntlMessageIds.d.ts'

const defaultTranslation = await readFile(
	join(workspaceDir, translationPathname(defaultLanguage))
)

const pathname = join(typesDir, FormatjsIntlMessageIdsFilename)

const translationKeys = Object.keys(defaultTranslation)

const content = `// This file is generated

export declare type FormatjsIntlMessageId =
  | ${translationKeys.map((key) => `'${key}'`).join('\n  | ')}

declare global {
	namespace FormatjsIntl {
		interface Message {
			ids: FormatjsIntlMessageId;
		}
	}
}
`
// TODO write article about this namespace FormatjsIntl trick
// then remove it, rename it properly like I18nMessageId, etc
// and write the file in i18n folder

await writeFile(pathname, content)
