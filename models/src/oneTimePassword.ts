import { EmailAddress } from "./email.js";
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
  value: unknown
): value is OneTimePasswordCode => {
  if (typeof value !== "string") return false;
  return value.length === oneTimePasswordCodeLength;
};

export type OneTimePassword = CreationTime & {
  code: OneTimePasswordCode;
};

export const isOneTimePassword = (value: unknown): value is OneTimePassword => {
  if (typeof value !== "object" || value === null) return false;
  const { code, whenCreated } = value as Partial<OneTimePassword>;
  return isOneTimePasswordCode(code) && isCreationTime({ whenCreated });
};

export const normalizeOneTimePassword = (
  code: OneTimePasswordCode
): OneTimePasswordCode => code.toLowerCase().trim();

export const generateOneTimePassword = (): OneTimePassword => {
  const code = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, oneTimePasswordCodeLength);

  return { code: normalizeOneTimePassword(code), ...createdNow() };
};

export type CreateOneTimePassword = Operation<EmailAddress, OneTimePassword>;

export type ReadOneTimePassword = Operation<
  EmailAddress,
  OneTimePassword | undefined
>;

export type DeleteOneTimePassword = Operation<EmailAddress, DeletionTime>;

export type SendOneTimePassword = Operation<
  { email: EmailAddress; oneTimePassword: OneTimePassword },
  CreationTime
>;
