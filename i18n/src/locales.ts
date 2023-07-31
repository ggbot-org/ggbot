export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = locales[0];

export const detectLocale = (): Locale => {
  for (const locale of locales)
    if (window.navigator.language.startsWith(locale)) return locale;
  return defaultLocale;
};

export const localeJsonPathname = (locale: Locale) =>
  `/translations/${locale}.json`;
