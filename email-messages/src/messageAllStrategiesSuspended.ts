import { ENV } from "@workspace/env"
import { Language } from "@workspace/models"

import { emailBody } from "./emailFragments.js"
import { EmailMessageContent, GetEmailMessageContent } from "./emailMessage.js"

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

export const allStrategiesSuspendedEmailMessage: GetEmailMessageContent<
	void
> = (language): EmailMessageContent => {
	const html: Record<Language, string> = {
		en: emailBody(`
          <tr>
            <td>
              All your ${PROJECT_SHORT_NAME} strategies have been <b>suspended</b>.
            </td>
          </tr>
        `)
	}

	const text: Record<Language, string> = {
		en: `
All your ${PROJECT_SHORT_NAME} strategies have been suspended.
`
	}

	const subject: Record<Language, string> = {
		en: `${PROJECT_SHORT_NAME} · all strategies suspended`
	}

	return {
		html: html[language],
		text: text[language],
		subject: subject[language]
	}
}
