import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="language-switcher">
      <button className={i18n.language === 'kv' ? 'active' : ''} onClick={() => changeLanguage('kv')}>КО</button>
      <button className={i18n.language === 'udm' ? 'active' : ''} onClick={() => changeLanguage('udm')}>УДМ</button>
      <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
      <button className={i18n.language === 'ru' ? 'active' : ''} onClick={() => changeLanguage('ru')}>РУ</button>
    </div>
  );
}

export default LanguageSwitcher;