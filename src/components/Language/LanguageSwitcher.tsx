import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SUPPORTED_LOCALES, LOCALE_LABELS, isSupportedLocale, DEFAULT_LOCALE, type Locale } from '../../i18n/locales';

interface LanguageSwitcherProps {
  className?: string;
}

// Self-contained: reads the current locale from the /:locale route param and
// navigates to the same path under the other locale, so switching language
// never loses the user's place in the app.
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const location = useLocation();
  const navigate = useNavigate();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    const rest = location.pathname.replace(new RegExp(`^/${locale}`), '');
    navigate(`/${next}${rest}${location.search}`);
  };

  return (
    <div
      className={`flex items-center gap-0.5 bg-slate-50 border border-slate-200/80 rounded-full p-0.5 shrink-0 ${className}`}
      role="group"
      aria-label={t('languageSelectorLabel')}
    >
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          id={`language-switcher-${l}-btn`}
          onClick={() => switchTo(l)}
          title={LOCALE_LABELS[l]}
          aria-pressed={locale === l}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition ${
            locale === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {locale === l && <Languages className="w-3 h-3" />}
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
