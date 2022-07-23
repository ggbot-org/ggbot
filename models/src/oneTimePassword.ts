import { CreationTime, createdNow } from "./time.js";

export type OneTimePassword = CreationTime & {
  otp: string;
};

export const oneTimePasswordLength = 6;

export function generateOneTimePassword(): OneTimePassword {
  const otp = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, oneTimePasswordLength);

  return { otp, ...createdNow() };
}
