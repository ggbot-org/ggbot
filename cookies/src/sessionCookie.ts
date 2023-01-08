import { getDate, truncateDate } from "@ggbot2/time";
import {
  Cookies,
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

export const readSessionCookie = (cookies: Cookies): Session | undefined => {
  const serializedSession = cookies[SESSION_COOKIE_NAME];
  if (typeof serializedSession !== "string") return;
  const [accountId, creationDay] = serializedSession.split(separator);
  const session = { accountId, creationDay };
  if (isSession(session)) return session;
};

export const deleteSessionCookie = () => deleteCookie(SESSION_COOKIE_NAME);
