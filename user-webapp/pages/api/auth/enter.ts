import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { sendEmail } from "@ggbot2/aws";
import { createOneTimePassword } from "@ggbot2/database";
import { oneTimePasswordEmailMessage } from "@ggbot2/email-messages";
import { EmailAddress, isEmailAddress } from "@ggbot2/models";
import type { NextApiRequest, NextApiResponse } from "next";

type RequestData = {
  email: EmailAddress;
};

type ResponseData = {
  ok: boolean;
};

function isRequestData(value: unknown): value is RequestData {
  if (typeof value !== "object" || value === null) return false;
  const { email } = value as Partial<RequestData>;
  return isEmailAddress(email);
}

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST") return res.status(__405__METHOD_NOT_ALLOWED__);

    const input = req.body;
    if (!isRequestData(input)) return res.status(__400__BAD_REQUEST__);
    const { email } = input;

    const code = await createOneTimePassword(email);

    const emailMessage = oneTimePasswordEmailMessage({ code });

    await sendEmail({ email, ...emailMessage });

    res.status(__200__OK__).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({ ok: false });
  }
}
