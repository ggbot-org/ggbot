import { logoPng192 } from "@ggbot2/assets";
import { OneTimePassword } from "@ggbot2/models";
import type { EmailMessageContent } from "./emailMessage.js";

export const oneTimePasswordEmailMessage = ({
  oneTimePassword: { code },
}: {
  oneTimePassword: OneTimePassword;
}): EmailMessageContent => {
  const html = `
<table>
  <tbody>
    <tr>
      <td align="center">
        <img src="${logoPng192}">
      </td>
    </tr>

    <tr>
      <td align="center" style="font-family:monospace">
        <h1>${code}</h1>
      </td>
    </tr>
  </tbody>
</table>`;

  const text = `${code}`;

  return {
    html,
    text,
    subject: "ggbot2 · One Time Password",
  };
};
