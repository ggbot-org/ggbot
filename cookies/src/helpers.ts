import { getDate } from "@ggbot2/time";

import { isSession, Session, sessionNumDays } from "./session.js";
import { readSessionCookie } from "./sessionCookie.js";

export const readSession = (cookies: string): Session | undefined => {
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
