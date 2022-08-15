import { sendEmail } from "@ggbot2/aws";
import { createEmailCookie } from "@ggbot2/cookies";
import { createOneTimePassword } from "@ggbot2/database";
import { oneTimePasswordEmailMessage } from "@ggbot2/email-messages";
import { nodeEnvIsProduction } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { noReplyAddress } from "@ggbot2/infrastructure";
import { EmailAddress, isEmailAddress } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";

export type ApiEnterRequestData = {
  email: EmailAddress;
};

export const isApiEnterRequestData = (
  value: unknown
): value is ApiEnterRequestData => {
  if (typeof value !== "object" || value === null) return false;
  const { email } = value as Partial<ApiEnterRequestData>;
  return isEmailAddress(email);
};

export type ApiEnterResponseData = {
  emailSent?: boolean | undefined;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiEnterResponseData>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const input = req.body;
    if (!isApiEnterRequestData(input))
      return res.status(__400__BAD_REQUEST__).json({});

    const { email } = input;

    const oneTimePassword = await createOneTimePassword(email);

    const emailMessage = oneTimePasswordEmailMessage({ oneTimePassword });

    await sendEmail({
      source: noReplyAddress,
      toAddresses: [email],
      ...emailMessage,
    });

    const cookie = createEmailCookie(email, { secure: nodeEnvIsProduction });
    res.setHeader("Set-Cookie", cookie);
    res.status(__200__OK__).json({ emailSent: true });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
