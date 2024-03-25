import React, { useState } from "react";

function LanguagesList({ selectedLang, setLanguage, languages, t, isSrc }) {
  const [filter, setFilter] = useState("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.toLowerCase().includes(filter.toLowerCase()) ||
      t(lang).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={!isSrc ? "languages-container tgt" : "languages-container"}>
      <input
        className="filter-languages"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && filteredLanguages.length > 0) {
            setLanguage(filteredLanguages[0]);
          }
        }}
        placeholder={t("Filter")}
        autoFocus
      />
      <div className={!isSrc ? "languages-list tgt" : "languages-list"}>
        {filteredLanguages.map((lang) => (
          <div
            key={lang}
            className={selectedLang === lang ? "language active" : "language"}
            onClick={() => setLanguage(lang)}
          >
            <span>{t(lang)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LanguagesList;
