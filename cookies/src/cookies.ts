import { CookieSerializeOptions, serialize } from "cookie";

// Copied from NextApiRequest['cookies']
export type Cookies = Partial<{
  [key: string]: string;
}>;

export const EMAIL_COOKIE_NAME = "email";
export const SESSION_COOKIE_NAME = "sessionid";
type CookieName = typeof EMAIL_COOKIE_NAME | typeof SESSION_COOKIE_NAME;

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
