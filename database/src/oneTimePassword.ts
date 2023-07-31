import { sendEmail } from "@ggbot2/aws";
import { oneTimePasswordEmailMessage } from "@ggbot2/email-messages";
import { noReplyEmailAddress } from "@ggbot2/locators";
import {
  createdNow,
  CreateOneTimePassword,
  deletedNow,
  DeleteOneTimePassword,
  generateOneTimePassword,
  ReadOneTimePassword,
  SendOneTimePassword,
} from "@ggbot2/models";
import { isTestAccountEmail, testOtp } from "@ggbot2/test-data";

import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  const Key = pathname.oneTimePassword(email);
  const data = generateOneTimePassword();
  await putObject({ Key, data });
  return data;
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  return await getObject<ReadOneTimePassword["out"]>({
    Key: pathname.oneTimePassword(email),
  });
};

export const deleteOneTimePassword: DeleteOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return deletedNow();
  const Key = pathname.oneTimePassword(email);
  return await deleteObject({ Key });
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
