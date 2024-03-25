import React from "react";

function LanguagesList({ selectedLang, setLanguage, languages, t, isSrc }) {
  return (
    <div className={!isSrc ? "languages-list tgt" : "languages-list"}>
      {languages.map((lang) => (
        <div key={lang} className={selectedLang === lang ? "language active" : "language"} onClick={() => setLanguage(lang)}>
            <span>
                {t(lang)}
            </span>
        </div>
      ))}
    </div>
  );
}

export default LanguagesList;
