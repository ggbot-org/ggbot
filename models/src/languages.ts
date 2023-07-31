export const defaultLanguage = "en";
export const languages = [defaultLanguage] as const;
export type Language = (typeof languages)[number];
