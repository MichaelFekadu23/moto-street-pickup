// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import amTranslation from './locales/am/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      am: { translation: amTranslation }
    },
    lng: 'am', // default to Amharic for Ethiopian users
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;