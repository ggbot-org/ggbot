import { ENV } from '@workspace/env'
import { Language, StrategyKey } from '@workspace/models'

import { emailBody } from './emailFragments.js'
import { EmailMessageContent } from './types.js'
import { webapp } from './webapp.js'

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

export function suspendedStrategyEmailMessage(
	language: Language,
	{ strategyId, strategyKind }: StrategyKey
): EmailMessageContent {
	const linkToStrategyHref = webapp.user.strategy({
		strategyId,
		strategyKind,
	}).href

	const html: Record<Language, string> = {
		en: emailBody(`
          <tr>
            <td>
              Your ${PROJECT_SHORT_NAME} strategy has been suspended.
            </td>
          </tr>

          <tr>
            <td>
			  <ul>
			    <li>
                  Strategy ID: <span style="font-family:monospace">${strategyId}</span>
				</li>

			    <li>
                  Strategy kind: <em>${strategyKind}</em>
				</li>
			  </ul>
            </td>
          </tr>

          <tr>
            <td>
              Please check your funds or any other error.
            </td>
          </tr>

          <tr>
            <td>
              This is the <a href="${linkToStrategyHref}">link to your strategy</a>.
            </td>
          </tr>
        `),
	}

	const text: Record<Language, string> = {
		en: `
Your ${PROJECT_SHORT_NAME} strategy has been suspended.

  Strategy ID: ${strategyId}
  Strategy kind: ${strategyKind}

Please check your funds or any other error.

This is the link to your strategy: ${linkToStrategyHref}
`,
	}

	const subject: Record<Language, string> = {
		en: `${PROJECT_SHORT_NAME} · suspended strategy · ${strategyId}`,
	}

	return {
		html: html[language],
		text: text[language],
		subject: subject[language],
	}
}
