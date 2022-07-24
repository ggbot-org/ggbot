import { EmailAddress, normalizeEmailAddress } from "@ggbot2/models";

export const emailToDirname = (email: EmailAddress) => {
  const normalizedEmailAddress = normalizeEmailAddress(email);
  return normalizedEmailAddress.split("@").reverse().join("/");
};
