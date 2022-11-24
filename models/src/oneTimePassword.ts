import type { EmailAddress } from "./email.js";
import type { Operation } from "./operation.js";
import {
  CreationTime,
  createdNow,
  isCreationTime,
  DeletionTime,
} from "./time.js";

type OneTimePasswordCode = string;

export const oneTimePasswordCodeLength = 6;

export const isOneTimePasswordCode = (
  arg: unknown
): arg is OneTimePasswordCode =>
  typeof arg === "string" && arg.length === oneTimePasswordCodeLength;

export type OneTimePassword = CreationTime & {
  code: OneTimePasswordCode;
};

export const isOneTimePassword = (arg: unknown): arg is OneTimePassword => {
  if (typeof arg !== "object" || arg === null) return false;
  const { code, whenCreated } = arg as Partial<OneTimePassword>;
  return isOneTimePasswordCode(code) && isCreationTime({ whenCreated });
};

export const generateOneTimePassword = (): OneTimePassword => {
  const chars = [];
  while (chars.length < oneTimePasswordCodeLength)
    chars.push(String(Math.floor(Math.random() * 10)));
  return { code: chars.join(""), ...createdNow() };
};

export type CreateOneTimePassword = Operation<EmailAddress, OneTimePassword>;

export type ReadOneTimePassword = Operation<
  EmailAddress,
  OneTimePassword | null
>;

export type DeleteOneTimePassword = Operation<EmailAddress, DeletionTime>;

export type SendOneTimePassword = Operation<
  { email: EmailAddress; oneTimePassword: OneTimePassword },
  CreationTime
>;
