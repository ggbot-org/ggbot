import {
  createdNow,
  CreateEmailAccount,
  EmailAccount,
  ReadEmailAccount,
} from "@ggbot2/models";

import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const createEmailAccount: CreateEmailAccount["func"] = async ({
  accountId,
  email,
}) => {
  const Key = pathname.emailAccount(email);
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
    Key: pathname.emailAccount(email),
  });
