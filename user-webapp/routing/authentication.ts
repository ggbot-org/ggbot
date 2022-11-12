import { Session, isSession, readSessionCookie } from "@ggbot2/cookies";
import { getDate } from "@ggbot2/time";
import type { NextApiRequest } from "next";

export const readSession = (
  cookies: NextApiRequest["cookies"]
): Session | undefined => {
  const numDays = 30;
  const session = readSessionCookie(cookies);
  if (!isSession(session)) return;
  const { creationDay } = session;
  const sessionIsNotExpired =
    new Date(creationDay) > getDate(new Date()).plus(numDays).days();
  if (sessionIsNotExpired) return session;
};
