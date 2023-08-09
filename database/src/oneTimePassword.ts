import { sendEmail } from "@ggbot2/aws";
import { oneTimePasswordEmailMessage } from "@ggbot2/email-messages";
import { noReplyEmailAddress } from "@ggbot2/locators";
import {
  createdNow,
  CreateOneTimePassword,
  deletedNow,
  DeleteOneTimePassword,
  generateOneTimePassword,
  isOneTimePassword,
  ReadOneTimePassword,
  SendOneTimePassword,
} from "@ggbot2/models";
import { isTestAccountEmail, testOtp } from "@ggbot2/test-data";

import { DELETE, putObject, READ } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  const data = generateOneTimePassword();
  await putObject(pathname.oneTimePassword(email), data);
  return data;
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  return await READ<ReadOneTimePassword["out"]>(
    isOneTimePassword,
    pathname.oneTimePassword(email)
  );
};

export const deleteOneTimePassword: DeleteOneTimePassword["func"] = async (
  arg
) => {
  if (isTestAccountEmail(arg)) return deletedNow();
  return await DELETE(pathname.oneTimePassword(arg));
};

export const sendOneTimePassword: SendOneTimePassword["func"] = async ({
  language,
  email,
  oneTimePassword,
}) => {
  const whenCreated = createdNow();
  if (isTestAccountEmail(email)) return whenCreated;
  const emailMessage = oneTimePasswordEmailMessage(language, {
    oneTimePassword,
  });
  await sendEmail({
    source: noReplyEmailAddress,
    toAddresses: [email],
    ...emailMessage,
  });
  return whenCreated;
};
