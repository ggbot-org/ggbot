import { getDate, truncateDate } from "@ggbot2/time";
import {
  CreateCookieOptions,
  SESSION_COOKIE_NAME,
  createCookie,
  deleteCookie,
} from "./cookies.js";
import { Session, isSession, sessionNumDays } from "./session.js";

const separator = "_";

const serializeSessionCookie = ({ accountId, creationDay }: Session) =>
  [accountId, creationDay].join(separator);

export const createSessionCookie = (
  session: Session,
  { secure }: Pick<CreateCookieOptions, "secure">
) => {
  const maxAge = 60 * 60 * 24 * sessionNumDays;
  const todayDate = truncateDate(new Date()).to.day();
  const expires = getDate(todayDate).plus(sessionNumDays).days();

  const content = serializeSessionCookie(session);

  return createCookie(SESSION_COOKIE_NAME, content, {
    expires,
    maxAge,
    secure,
  });
};

export const readSessionCookie = (cookies: string): Session | undefined => {
  let serializedSession: string | undefined;
  // TODO put this in a getCookieValue(cookies, cookieName) or parseCookies(cookies): {[key in string]: string}
  for (const cookie of cookies.split(";")) {
    const [name, value] = cookie.split("=");
    if (name === SESSION_COOKIE_NAME) {
      serializedSession = value;
      break;
    }
  }
  if (typeof serializedSession !== "string") return;
  const [accountId, creationDay] = serializedSession.split(separator);
  const session = { accountId, creationDay };
  if (isSession(session)) return session;
};

export const deleteSessionCookie = () => deleteCookie(SESSION_COOKIE_NAME);
