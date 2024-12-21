import { ENV } from '@workspace/env'

function emailFooter(){
	return `
<tr>
  <td>
    ${ENV.PROJECT_SHORT_NAME()} <em>${ENV.PROJECT_TAG_LINE()}</em>
  </td>
</tr>
`
}

/** @param {string} body */
export function emailBody(body) {
	return `
<table>
  <tbody>
    ${body}
	${emailFooter()}
  </tbody>
</table>
`
}
