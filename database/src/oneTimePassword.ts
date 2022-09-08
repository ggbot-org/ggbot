import { sendEmail } from "@ggbot2/aws";
import { oneTimePasswordEmailMessage } from "@ggbot2/email-messages";
import { noReplyAddress } from "@ggbot2/infrastructure";
import {
  CreateOneTimePassword,
  DeleteOneTimePassword,
  ReadOneTimePassword,
  SendOneTimePassword,
  createdNow,
  generateOneTimePassword,
  deletedNow,
} from "@ggbot2/models";
import { isTestAccountEmail, testOtp } from "@ggbot2/test-data";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { oneTimePasswordPathname } from "./_dataBucketLocators.js";

export const createOneTimePassword: CreateOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  const Key = oneTimePasswordPathname(email);
  const data = generateOneTimePassword();
  await putObject({ Key, data });
  return data;
};

export const readOneTimePassword: ReadOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return testOtp;
  return await getObject<ReadOneTimePassword["out"]>({
    Key: oneTimePasswordPathname(email),
  });
};

export const deleteOneTimePassword: DeleteOneTimePassword["func"] = async (
  email
) => {
  if (isTestAccountEmail(email)) return deletedNow();
  return await deleteObject({ Key: oneTimePasswordPathname(email) });
};

export const sendOneTimePassword: SendOneTimePassword["func"] = async ({
  email,
  oneTimePassword,
}) => {
  const whenCreated = createdNow();
  if (isTestAccountEmail(email)) return whenCreated;
  const emailMessage = oneTimePasswordEmailMessage({ oneTimePassword });
  await sendEmail({
    source: noReplyAddress,
    toAddresses: [email],
    ...emailMessage,
  });
  return whenCreated;
};
