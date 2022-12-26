const UTRUST_API_KEY = process.env.NEXT_PUBLIC_UTRUST_API_KEY;

export const getUtrustApiKey = (): string => {
  if (typeof UTRUST_API_KEY === "string") return UTRUST_API_KEY;
  return "";
};
