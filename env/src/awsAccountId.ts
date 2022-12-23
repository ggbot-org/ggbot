const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;

export const getAwsAccountId = (): string => {
  if (typeof AWS_ACCOUNT_ID === "string") return AWS_ACCOUNT_ID;
  return "";
};
