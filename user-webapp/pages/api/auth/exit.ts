import { wwwDomain } from "@ggbot2/aws";
import { deleteEmailCookie, deleteSessionCookie } from "@ggbot2/cookies";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    res.setHeader("Set-Cookie", [deleteEmailCookie(), deleteSessionCookie()]);
    res.redirect(`https://${wwwDomain}`);
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}