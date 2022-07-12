import { AWSError } from "aws-sdk";

export function isAwsError(error: unknown): error is AWSError {
  if (typeof error !== "object" || error === null) return false;
  const { code, message, time } = error as Partial<AWSError>;
  return (
    typeof code === "string" &&
    typeof message === "string" &&
    time instanceof Date
  );
}
