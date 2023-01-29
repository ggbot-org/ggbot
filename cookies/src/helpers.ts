import { getDate } from "@ggbot2/time";
import { Cookies } from "./cookies.js";
import { Session, isSession, sessionNumDays } from "./session.js";
import { readSessionCookie } from "./sessionCookie.js";

export const readSession = (cookies: Cookies): Session | undefined => {
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
