import { Session, isSession } from "@ggbot2/models";
import { addSeconds, truncateDate } from "@ggbot2/time";
import {
  Cookies,
  CreateCookieOptions,
  SESSION_COOKIE_NAME,
  createCookie,
  deleteCookie,
} from "./cookies.js";

const separator = "_";

function serializeCookieSession({ id, creationDay }: Session): string {
  return [id, creationDay].join(separator);
}

export const createSessionCookie = (
  session: Session,
  { secure }: Pick<CreateCookieOptions, "secure">
) => {
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  const todayDate = truncateDate(new Date());
  const expires = addSeconds(maxAge, todayDate);

  const content = serializeCookieSession(session);

  return createCookie(SESSION_COOKIE_NAME, content, {
    expires,
    maxAge,
    secure,
  });
};

export function readSessionCookie(cookies: Cookies): Session | undefined {
  const serializedSession = cookies[SESSION_COOKIE_NAME];
  if (typeof serializedSession !== "string") return;
  const [id, creationDay] = serializedSession.split(separator);
  const session = { id, creationDay };
  if (isSession(session)) return session;
}

export const deleteSessionCookie = () => deleteCookie(SESSION_COOKIE_NAME);
