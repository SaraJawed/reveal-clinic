import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './locales';

// Eagerly load every namespace file under locales/messages/<locale>/<namespace>.json.
// Adding a new namespace is just "add a JSON file in both locale folders" --
// nothing here needs to change to register it.
const modules = import.meta.glob('../../locales/messages/*/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>;

const resources: Record<string, Record<string, unknown>> = {};

for (const path in modules) {
  const match = path.match(/locales\/messages\/([a-zA-Z-]+)\/([a-zA-Z0-9_-]+)\.json$/);
  if (!match) continue;
  const [, locale, namespace] = match;
  resources[locale] = resources[locale] || {};
  resources[locale][namespace] = modules[path].default;
}

const namespaces = Object.keys(resources[DEFAULT_LOCALE] || {});

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES as unknown as string[],
  ns: namespaces,
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnEmptyString: false
});

export default i18n;
