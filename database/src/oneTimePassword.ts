import {
  CreateOneTimePassword,
  DeleteOneTimePassword,
  EmailAddress,
  ReadOneTimePassword,
  generateOneTimePassword,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { emailToDirname } from "./email.js";

const oneTimePasswordDirnamePrefix = () => "oneTimePassword";

export const oneTimePasswordPathname = (email: EmailAddress) =>
  `${oneTimePasswordDirnamePrefix()}/${emailToDirname(email)}/otp.json`;

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  _
) => {
  const Key = oneTimePasswordPathname(_);
  const data = generateOneTimePassword();
  await putObject({ Key, data });
  return data.code;
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (email) =>
  await getObject<ReadOneTimePassword["out"]>({
    Key: oneTimePasswordPathname(email),
  });

export const deleteOneTimePassword: DeleteOneTimePassword["func"] = async (_) =>
  await deleteObject({ Key: oneTimePasswordPathname(_) });
