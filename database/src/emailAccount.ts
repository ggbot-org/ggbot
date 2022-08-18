import {
  CreateEmailAccount,
  EmailAddress,
  ReadEmailAccount,
  createdNow,
  EmailAccount,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
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

export const readEmailAccount: ReadEmailAccount["func"] = async (email) =>
  await getObject<ReadEmailAccount["out"]>({
    Key: emailAccountPathname(email),
  });
