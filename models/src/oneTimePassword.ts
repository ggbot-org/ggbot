import { objectTypeGuard } from "@ggbot2/type-utils";

import { EmailAddress } from "./email.js";
import { Language } from "./languages.js";
import { DeleteOperation, Operation, ReadOperation } from "./operation.js";
import { createdNow, CreationTime, isCreationTime } from "./time.js";

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

export type ReadOneTimePassword = ReadOperation<EmailAddress, OneTimePassword>;

export type DeleteOneTimePassword = DeleteOperation<EmailAddress>;

export type SendOneTimePassword = Operation<
  { email: EmailAddress; oneTimePassword: OneTimePassword; language: Language },
  CreationTime
>;
