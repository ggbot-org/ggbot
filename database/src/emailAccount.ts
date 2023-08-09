import {
  createdNow,
  CreateEmailAccount,
  EmailAccount,
  isEmailAccount,
  ReadEmailAccount,
} from "@ggbot2/models";

import { putObject, READ } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const createEmailAccount: CreateEmailAccount["func"] = async ({
  accountId,
  email,
}) => {
  const creationTime = createdNow();
  const data: EmailAccount = {
    accountId,
    email,
    ...creationTime,
  };
  await putObject(pathname.emailAccount(email), data);
  return creationTime;
};

export const readEmailAccount: ReadEmailAccount["func"] = (arg) =>
  READ<ReadEmailAccount["out"]>(isEmailAccount, pathname.emailAccount(arg));
