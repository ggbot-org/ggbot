export type EmailAddress = `${string}@${string}`;

export function isEmailAddress(value: unknown): value is EmailAddress {
  if (typeof value !== "string") return false;
  const [user, domain] = value.split("@");
  if (typeof user !== "string" || typeof domain !== "string") return false;
  return true;
}
