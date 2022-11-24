import type { OneTimePassword } from "@ggbot2/models";
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
</table>`;

  const text = `
Copy and paste this ggbot2 "one time password" to get access to your account:

${code}
`;

  return {
    html,
    text,
    subject: `ggbot2 · one time password · ${code}`,
  };
};
