import { defaultLanguage, languages } from "@ggbot2/models";

export const defaultLocale = defaultLanguage;

export const detectLocale = () => {
  // TODO read also from local storage, which is written by SelectLanguage component in Navigation.
  for (const language of languages)
    if (window.navigator.language.startsWith(language)) return language;
  return defaultLocale;
};

export type Locale = ReturnType<typeof detectLocale>;

export const localeJsonPathname = (locale: Locale) =>
  `/translations/${locale}.json`;
