import { deleteObject, getObject, putObject } from "@ggbot2/aws";
import {
  CreateOneTimePassword,
  DeleteOneTimePassword,
  EmailAddress,
  ReadOneTimePassword,
  deletedNow,
  generateOneTimePassword,
  isOneTimePassword,
} from "@ggbot2/models";
import { emailToDirname } from "./email.js";

const oneTimePasswordDirnamePrefix = () => "oneTimePassword";

export const oneTimePasswordPathname = (email: EmailAddress) =>
  `${oneTimePasswordDirnamePrefix()}/${emailToDirname(email)}/otp.json`;

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  email
) => {
  const Key = oneTimePasswordPathname(email);
  const data = generateOneTimePassword();
  await putObject({ Key, data });
  return data.code;
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (
  email
) => {
  const Key = oneTimePasswordPathname(email);
  const data = await getObject({ Key });
  if (isOneTimePassword(data)) return data;
  throw new TypeError(`Invalid OneTimePassword ${data}`);
};

export const deleteOneTimePassword: DeleteOneTimePassword["func"] = async (
  email
) => {
  const Key = oneTimePasswordPathname(email);
  await deleteObject({ Key });
  return deletedNow();
};
