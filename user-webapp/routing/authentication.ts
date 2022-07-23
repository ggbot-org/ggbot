import { readSessionCookie } from "@ggbot2/cookies";
import { addDays } from "@ggbot2/time";
import type { NextApiRequest } from "next";

type Cookies = NextApiRequest["cookies"];

const sessionNumDays = 30;

export const hasValidSessionCookie = (cookies: Cookies) => {
  const session = readSessionCookie(cookies);
  if (!session) return false;
  return new Date(session.creationDay) > addDays(-sessionNumDays, new Date());
};
