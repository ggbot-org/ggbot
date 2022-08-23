const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;

export const getAwsAccountId = (): string => {
  if (typeof AWS_ACCOUNT_ID === "string" && AWS_ACCOUNT_ID.length >= 12) {
    return AWS_ACCOUNT_ID;
  }
  return "";
};
