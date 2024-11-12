import { join } from 'node:path'

import { translationPathname } from '_/i18n/locales.js'
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

// ts-prune-ignore-next
export declare type FormatjsIntlMessageId =
  | ${translationKeys.map((key) => `"${key}"`).join('\n  | ')}

declare global {
	namespace FormatjsIntl {
		interface Message {
			ids: FormatjsIntlMessageId;
		}
	}
}
`

await writeFile(pathname, content)
