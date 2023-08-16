import { Language, OneTimePassword } from "@ggbot2/models"

import { EmailMessageContent, GetEmailMessageContent } from "./emailMessage.js"

export const oneTimePasswordEmailMessage: GetEmailMessageContent<{
	oneTimePassword: OneTimePassword
}> = (language, { oneTimePassword: { code } }): EmailMessageContent => {
	const html: Record<Language, string> = {
		en: `
<table>
  <tbody>
    <tr>
      <td>
        Copy and paste this ggbot2 <em>one time password</em> to get access to your account:
      </td>
    </tr>
    <tr>
      <td align="center" style="font-family:monospace">
        <h2>${code}</h2>
      </td>
    </tr>
    <tr>
      <td>
        ggbot2 <em>crypto flow</em>
      </td>
    </tr>
  </tbody>
</table>`
	}

	const text: Record<Language, string> = {
		en: `
Copy and paste this ggbot2 "one time password" to get access to your account:

${code}
`
	}

	const subject: Record<Language, string> = {
		en: `ggbot2 · one time password · ${code}`
	}

	return {
		html: html[language],
		text: text[language],
		subject: subject[language]
	}
}
