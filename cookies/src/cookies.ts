// TODO "cookie" dependency could be removed
import { CookieSerializeOptions, serialize } from "cookie";

export const SESSION_COOKIE_NAME = "sessionid";
type CookieName = typeof SESSION_COOKIE_NAME;

export type CreateCookieOptions = Pick<
  CookieSerializeOptions,
  "expires" | "maxAge" | "secure"
>;

export const createCookie = (
  name: CookieName,
  content: string,
  options: CreateCookieOptions
) =>
  serialize(name, content, {
    ...options,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

export const deleteCookie = (name: CookieName) =>
  serialize(name, "", {
    maxAge: -1,
    path: "/",
  });
