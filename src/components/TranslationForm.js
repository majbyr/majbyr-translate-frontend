// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { iso6393 } from "iso-639-3";
import { FaVolumeLow, FaStop } from "react-icons/fa6";

function TranslationForm({
  onTranslate,
  onTts,
  languages,
  ttsLanguages,
  translation,
  translationVariants,
  isAudioPlaying,
  setIsAudioPlaying,
}) {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("kpv");
  const [targetLang, setTargetLang] = useState("eng");
  const [showVariantsFlag, setShowVariantsFlag] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleInput = () => {
      if (inputRef.current) {
        setSourceText(inputRef.current.textContent);
      }
    };

    const div = inputRef.current;
    div.addEventListener("input", handleInput);

    return () => {
      div.removeEventListener("input", handleInput);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onTranslate(sourceText, sourceLang, targetLang);
    setShowVariantsFlag(false); // Reset the show variants flag on a new translation
  };

  const toggleVariants = () => {
    setShowVariantsFlag(!showVariantsFlag);
  };

  return (
    <form onSubmit={handleSubmit} className="translation-form">
      <div className="language-selectors">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {iso6393.find((l) => l.iso6393 === lang).name}
            </option>
          ))}
        </select>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {iso6393.find((l) => l.iso6393 === lang).name}
            </option>
          ))}
        </select>
      </div>
      <div className="text-areas">
        <div className="input-area">
          <div
            className="sourceText"
            ref={inputRef}
            contentEditable
            placeholder="Enter text"
            rows="10"
            cols="50"
            suppressContentEditableWarning={true}
          >
            {/* Do not directly render sourceText here */}
          </div>
          <div className="tools-area">
            <button
              className="tts-button"
              onClick={() => onTts(sourceText, sourceLang, setIsAudioPlaying)}
            >
              {isAudioPlaying ? <FaStop /> : <FaVolumeLow />}
            </button>
          </div>
        </div>
        <div className="translation-area">
          <div className="translationText">
            <span className="translatedSentence" onClick={toggleVariants}>
              {translation}
            </span>
            {showVariantsFlag && (
            <div className="translation-variants">
              {translationVariants.map((variant, index) => (
                <div className="variant" key={index}>
                  {variant}
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="tools-area">
            <button
              className="tts-button"
              onClick={() => onTts(translation, targetLang, setIsAudioPlaying)}
            >
              {isAudioPlaying ? <FaStop /> : <FaVolumeLow />}
            </button>
          </div>
        </div>
      </div>
      <button type="submit">Translate</button>
    </form>
  );
}

export default TranslationForm;
