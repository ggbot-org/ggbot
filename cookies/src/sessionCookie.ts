import {
  AccountKey,
  CreationDay,
  isAccountKey,
  isCreationDay,
} from "@ggbot2/models";
import { addSeconds, truncateDate } from "@ggbot2/time";
import {
  Cookies,
  CreateCookieOptions,
  SESSION_COOKIE_NAME,
  createCookie,
  deleteCookie,
} from "./cookies.js";

const separator = "_";

export type Session = AccountKey & CreationDay;

export const isSession = (value: unknown): value is Session => {
  if (typeof value !== "object" || value === null) return false;
  const { accountId, creationDay } = value as Partial<Session>;
  return isAccountKey({ accountId }) && isCreationDay({ creationDay });
};

const serializeSessionCookie = ({ accountId, creationDay }: Session) =>
  [accountId, creationDay].join(separator);

export const createSessionCookie = (
  session: Session,
  { secure }: Pick<CreateCookieOptions, "secure">
) => {
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  const todayDate = truncateDate(new Date());
  const expires = addSeconds(maxAge, todayDate);

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