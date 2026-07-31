import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import App from './App.tsx';
import i18n from './i18n/config';
import {getPreferredLocale} from './i18n/locales';
import './index.css';

function RootRedirect() {
  return <Navigate to={`/${getPreferredLocale()}`} replace />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:locale/*" element={<App />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>,
);
