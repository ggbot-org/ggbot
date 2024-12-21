import { ENV } from '@workspace/env'

import { emailBody } from './emailFragments.js'
import { webapp } from './webapp.js'

/**
 * @typedef {import('@workspace/models').Language} Language
 */

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

/**
 * @param {Language} language
 * @param {import('@workspace/models').StrategyKey} params
 * @returns {import('./types').EmailMessageContent}
 */
export function suspendedStrategyEmailMessage(
	language,
	{ strategyId, strategyKind }
) {
	const linkToStrategyHref = webapp.user.strategy({ strategyId, strategyKind }).href

	/** @type {Record<Language, string>} */
	const html = {
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
        `)
	}

	/** @type {Record<Language, string>} */
	const text = {
		en: `
Your ${PROJECT_SHORT_NAME} strategy has been suspended.

  Strategy ID: ${strategyId}
  Strategy kind: ${strategyKind}

Please check your funds or any other error.

This is the link to your strategy: ${linkToStrategyHref}
`
	}

	/** @type {Record<Language, string>} */
	const subject = {
		en: `${PROJECT_SHORT_NAME} · suspended strategy · ${strategyId}`
	}

	return {
		html: html[language],
		text: text[language],
		subject: subject[language]
	}
}
