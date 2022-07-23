import { EmailAddress } from "./email.js";
import type { Operation } from "./operation.js";
import { CreationTime, createdNow, isCreationTime } from "./time.js";

type OneTimePasswordCode = string;

export const oneTimePasswordCodeLength = 6;

export function isOneTimePasswordCode(
  value: unknown
): value is OneTimePasswordCode {
  if (typeof value !== "string") return false;
  return value.length === oneTimePasswordCodeLength;
}

export type OneTimePassword = CreationTime & {
  code: OneTimePasswordCode;
};

export function isOneTimePassword(value: unknown): value is OneTimePassword {
  if (typeof value !== "object" || value === null) return false;
  const { code, whenCreated } = value as Partial<OneTimePassword>;
  return isOneTimePasswordCode(code) && isCreationTime(whenCreated);
}

export function generateOneTimePasswordCode(): OneTimePassword {
  const code = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, oneTimePasswordCodeLength);

  return { code, ...createdNow() };
}

export type CreateOneTimePassword = Operation<EmailAddress, CreationTime>;

export type ReadOneTimePassword = Operation<EmailAddress, OneTimePassword>;
