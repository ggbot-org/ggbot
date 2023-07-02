export const defaultLocale = "en";

export const locales = [defaultLocale] as const;
export type Locale = (typeof locales)[number];

export const detectLocale = (): Locale => {
  const navigatorLang = window.navigator.language;
  for (const locale of locales) {
    if (navigatorLang.startsWith(locale)) return locale;
  }
  return defaultLocale;
};

export const localeJsonPathname = (locale: Locale) =>
  `/translations/${locale}.json`;
