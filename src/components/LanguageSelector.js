import React from "react";

function LanguageSelector({ selectedLang, handleSelectChange, languages, t }) {
  return (
    <select value={selectedLang} onChange={handleSelectChange}>
      {languages.map((lang) => (
        <option key={lang} value={lang}>{t(lang)}</option>
      ))}
    </select>
  );
}

export default LanguageSelector;
