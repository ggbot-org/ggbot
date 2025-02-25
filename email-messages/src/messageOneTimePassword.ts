import { ENV } from '@workspace/env'
import { Language, OneTimePassword } from '@workspace/models'

import { emailBody } from './emailFragments.js'
import { EmailMessageContent } from './types.js'

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

export function oneTimePasswordEmailMessage(
	language: Language,
	{ oneTimePassword: { code } }: { oneTimePassword: OneTimePassword }
): EmailMessageContent {
	const html: Record<Language, string> = {
		en: emailBody(`
          <tr>
            <td>
              Copy and paste this ${PROJECT_SHORT_NAME} <em>one time password</em> to get access to your account:
            </td>
          </tr>

          <tr>
            <td align="center" style="font-family:monospace">
              <h2>${code}</h2>
            </td>
          </tr>
        `),
	}

	const text: Record<Language, string> = {
		en: `
Copy and paste this ${PROJECT_SHORT_NAME} "one time password" to get access to your account:

${code}
`,
	}

	const subject: Record<Language, string> = {
		en: `${PROJECT_SHORT_NAME} · one time password · ${code}`,
	}

	return {
		html: html[language],
		text: text[language],
		subject: subject[language],
	}
}
