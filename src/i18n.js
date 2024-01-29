import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem('language');

i18n.use(initReactI18next).init({
    lng: savedLanguage || 'kv',
    resources: {
      en: require('./locales/en.json'),
      kv: require('./locales/kv.json'),
      ru: require('./locales/ru.json'),
      udm: require('./locales/udm.json'),
    },
    interpolation: {
      escapeValue: false,
    },
  });