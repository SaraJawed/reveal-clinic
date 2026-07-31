export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const RTL_LOCALES: readonly Locale[] = ['ar'];

const LOCALE_STORAGE_KEY = 'reveal_locale';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية'
};

export function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

export function persistLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

// Used only for the "/" -> "/:locale" redirect: a previously chosen locale
// wins, otherwise fall back to the browser's language, otherwise English.
// Once a locale is in the URL, the URL is the single source of truth --
// this helper is never consulted again after the initial redirect.
export function getPreferredLocale(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isSupportedLocale(stored || undefined)) return stored as Locale;
  const browserLang = window.navigator.language?.slice(0, 2).toLowerCase();
  if (isSupportedLocale(browserLang)) return browserLang;
  return DEFAULT_LOCALE;
}
