import React, { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import LanguagesList from "./LanguagesList";

// Custom hook for managing recent languages
function useRecentLanguages(storageKey, selectedLang) {
  const [recentLanguages, setRecentLanguages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    const parsedSaved = saved ? JSON.parse(saved) : [selectedLang];
    if (!parsedSaved.includes(selectedLang)) {
      return [selectedLang, ...parsedSaved].slice(0, 3);
    }
    return parsedSaved.slice(0, 3);
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(recentLanguages));
  }, [recentLanguages, storageKey]);

  return [recentLanguages, setRecentLanguages];
}

function LanguageSelector({
  selectedLang,
  handleSelectChange,
  setLanguage,
  languages,
  t,
  isSrc,
}) {
  const [languagesListVisible, setLanguagesListVisible] = useState(false);
  const [recentSourceLanguages, setRecentSourceLanguages] = useRecentLanguages("recentSourceLanguages", selectedLang);
  const [recentTargetLanguages, setRecentTargetLanguages] = useRecentLanguages("recentTargetLanguages", selectedLang);

  function updateRecentLanguages(language, isSource) {
    const [recentLanguages, setRecent] = isSource ? [recentSourceLanguages, setRecentSourceLanguages] : [recentTargetLanguages, setRecentTargetLanguages];
    if (!recentLanguages.includes(language)) {
      setRecent([language, ...recentLanguages].slice(0, 3));
    }
  }

  const onLanguageSelect = (lang) => {
    setLanguage(lang);
    updateRecentLanguages(lang, isSrc);
  };

  useEffect(() => { 
    setLanguagesListVisible(false); 
  }, [selectedLang]);

  useEffect(() => {
    if (isSrc && !recentSourceLanguages.includes(selectedLang)) {
      setRecentSourceLanguages([selectedLang, ...recentSourceLanguages].slice(0, 3));
    }
    if (!isSrc && !recentTargetLanguages.includes(selectedLang)) {
      setRecentTargetLanguages([selectedLang, ...recentTargetLanguages].slice(0, 3));
    }
  }, [selectedLang, isSrc, recentSourceLanguages, recentTargetLanguages, setRecentSourceLanguages, setRecentTargetLanguages]);


  const displayRecentLanguages = isSrc ? recentSourceLanguages : recentTargetLanguages;

  return (
    <div className="language-selector">
      <select
        value={selectedLang}
        onChange={(e) => {
          handleSelectChange(e);
          updateRecentLanguages(e.target.value, isSrc);
        }}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>{t(lang)}</option>
        ))}
      </select>
      <div className="recent-languages">
        {isSrc && <button disabled>A</button>}
        {displayRecentLanguages.map((lang) => (
          <button
            key={lang}
            className={selectedLang === lang ? "language active" : "language"}
            onClick={() => onLanguageSelect(lang)}
          >
            {t(lang)}
          </button>
        ))}
        <button
          className="more-languages-button"
          onClick={() => setLanguagesListVisible(!languagesListVisible)}
        >
          <FaAngleDown />
        </button>
      </div>
      {languagesListVisible && (
        <LanguagesList
          selectedLang={selectedLang}
          setLanguage={onLanguageSelect}
          languages={languages}
          t={t}
          isSrc={isSrc}
        />
      )}
    </div>
  );
}

export default LanguageSelector;
