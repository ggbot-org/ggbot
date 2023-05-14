// TODO this could be removed when Next.js is removed
import { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(
  _req: NextApiRequest,
  res: NextApiResponse<string>
) {
  return res.status(200).send("ok");
}
