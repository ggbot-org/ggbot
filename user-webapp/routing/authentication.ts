import { Session, isSession, readSessionCookie } from "@ggbot2/cookies";
import { getDate } from "@ggbot2/time";
import type { NextApiRequest } from "next";

export const sessionNumDays = 30;

export const readSession = (
  cookies: NextApiRequest["cookies"]
): Session | undefined => {
  const session = readSessionCookie(cookies);
  if (!isSession(session)) return;
  const { creationDay } = session;
  const expirationDate = getDate(new Date(creationDay))
    .plus(sessionNumDays)
    .days();
  const sessionIsExpired = expirationDate < new Date();
  if (sessionIsExpired) return;
  return session;
};
