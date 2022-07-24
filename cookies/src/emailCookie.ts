import { EmailAddress, isEmailAddress } from "@ggbot2/models";
import {
  Cookies,
  CreateCookieOptions,
  EMAIL_COOKIE_NAME,
  createCookie,
  deleteCookie,
} from "./cookies.js";

export const createEmailCookie = (
  email: EmailAddress,
  { secure }: Pick<CreateCookieOptions, "secure">
) => createCookie(EMAIL_COOKIE_NAME, email, { secure });

export const readEmailCookie = (cookies: Cookies): EmailAddress | undefined => {
  const email = cookies[EMAIL_COOKIE_NAME];
  if (isEmailAddress(email)) return email;
};

export const deleteEmailCookie = () => deleteCookie(EMAIL_COOKIE_NAME);
