import { ENV } from '@workspace/env';
import { emailBody } from './emailFragments.js';

/**
 * @typedef {import('@workspace/models').Language} Language
 * @typedef {import('@workspace/models').StrategyKey} StrategyKey
 */

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME();

/**
 * @param {Language} language
 * @param {{ oneTimePassword: import('@workspace/models').OneTimePassword }} params
 * @returns {import('./types').EmailMessageContent}
 */
export function oneTimePasswordEmailMessage(language, { oneTimePassword: { code } }) {
    const html = {
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
        `)
    };
    const text = {
        en: `
Copy and paste this ${PROJECT_SHORT_NAME} "one time password" to get access to your account:

${code}
`
    };
    const subject = {
        en: `${PROJECT_SHORT_NAME} · one time password · ${code}`
    };
    return {
        html: html[language],
        text: text[language],
        subject: subject[language]
    };
}
