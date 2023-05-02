import {
  __200__OK__,
  __204__NO_CONTENT__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { Session, createSessionCookie } from "@ggbot2/cookies";
import { ENV } from "@ggbot2/env";
import {
  createAccount,
  deleteOneTimePassword,
  readEmailAccount,
  readOneTimePassword,
} from "@ggbot2/database";
import {
  EmailAddress,
  OneTimePassword,
  isEmailAddress,
  isOneTimePasswordCode,
} from "@ggbot2/models";
import { today } from "@ggbot2/time";
import { objectTypeGuard } from "@ggbot2/type-utils";
import { NextApiRequest, NextApiResponse } from "next";

const { NODE_ENV } = ENV;

export type ApiVerifyRequestData = Pick<OneTimePassword, "code"> & {
  email: EmailAddress;
};

export const isApiVerifyRequestData = objectTypeGuard<ApiVerifyRequestData>(
  ({ code, email }) => isOneTimePasswordCode(code) && isEmailAddress(email)
);

export type ApiVerifyResponseData = {
  verified?: boolean | undefined;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiVerifyResponseData>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const input = req.body;
    if (!isApiVerifyRequestData(input)) return res.status(__400__BAD_REQUEST__);

    const { code, email } = input;

    const storedOneTimePassword = await readOneTimePassword(email);
    if (!storedOneTimePassword) return res.status(__204__NO_CONTENT__).end();

    const verified = code === storedOneTimePassword.code;

    if (!verified) return res.status(__200__OK__).json({ verified });

    await deleteOneTimePassword(email);

    const emailAccount = await readEmailAccount(email);

    const creationDay = today();

    const createCookye = (session: Session) => {
      const cookie = createSessionCookie(session, {
        secure: NODE_ENV === "production",
      });
      res.setHeader("Set-Cookie", cookie);
    };

    if (emailAccount) {
      const session = { creationDay, accountId: emailAccount.accountId };
      createCookye(session);
    } else {
      const account = await createAccount({ email });
      const session = { creationDay, accountId: account.id };
      createCookye(session);
    }

    res.status(__200__OK__).json({ verified });
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
