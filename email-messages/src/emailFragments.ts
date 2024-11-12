import { ENV } from '@workspace/env'

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

const emailFooter = () => `
<tr>
  <td>
    ${PROJECT_SHORT_NAME} <em>crypto flow</em>
  </td>
</tr>
`

export const emailBody = (body: string) => `
<table>
  <tbody>
    ${body}
	${emailFooter()}
  </tbody>
</table>
`
