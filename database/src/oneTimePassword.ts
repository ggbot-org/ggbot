import { getObject, putObject } from "@ggbot2/aws";
import {
  CreateOneTimePassword,
  EmailAddress,
  ReadOneTimePassword,
  generateOneTimePasswordCode,
  isOneTimePassword,
} from "@ggbot2/models";
import { emailToDirname } from "./email.js";

function oneTimePasswordDirnamePrefix() {
  return "oneTimePassword";
}

export function oneTimePasswordPathname(email: EmailAddress) {
  return `${oneTimePasswordDirnamePrefix()}/${emailToDirname(email)}/otp.json`;
}

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  email
) => {
  const Key = oneTimePasswordPathname(email);
  const data = generateOneTimePasswordCode();
  await putObject({ Key, data });
  return { whenCreated: data.whenCreated };
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (
  email
) => {
  const Key = oneTimePasswordPathname(email);
  const data = await getObject({ Key });
  if (isOneTimePassword(data)) return data;
  throw new TypeError(`Invalid OneTimePassword ${data}`);
};
