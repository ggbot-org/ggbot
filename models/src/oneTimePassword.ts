import type { EmailAddress } from "./email.js";
import { objectTypeGuard } from "./objects.js";
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

export const isOneTimePassword = objectTypeGuard<OneTimePassword>(
  ({ code, ...creationTime }) =>
    isOneTimePasswordCode(code) && isCreationTime(creationTime)
);

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
