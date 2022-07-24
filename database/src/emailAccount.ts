import { getObject, putObject } from "@ggbot2/aws";
import {
  CreateEmailAccount,
  EmailAddress,
  ErrorItemNotValid,
  ReadEmailAccount,
  createdNow,
  isEmailAccount,
  EmailAccount,
} from "@ggbot2/models";
import { emailToDirname } from "./email.js";

export const emailAccountDirnamePrefix = () => "emailAccount";

export const emailAccountPathname = (email: EmailAddress) =>
  `${emailAccountDirnamePrefix()}/${emailToDirname(email)}/account.json`;

export const createEmailAccount: CreateEmailAccount["func"] = async ({
  accountId,
  email,
}) => {
  const Key = emailAccountPathname(email);
  const creationTime = createdNow();
  const data: EmailAccount = {
    accountId,
    email,
    ...creationTime,
  };
  await putObject({ Key, data });
  return creationTime;
};

export const readEmailAccount: ReadEmailAccount["func"] = async (email) => {
  const Key = emailAccountPathname(email);
  const data = await getObject({ Key });
  if (!data) return;
  if (!isEmailAccount(data)) throw new ErrorItemNotValid();
  return data;
};
