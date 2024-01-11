// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { iso6393 } from "iso-639-3";
import { FaVolumeLow, FaStop, FaArrowRightArrowLeft } from "react-icons/fa6";

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
    let timerId = null;
  
    const handleInput = () => {
      if (inputRef.current) {
        if (timerId) {
          clearTimeout(timerId); // clear the previous timer if it exists
        }
  
        timerId = setTimeout(() => {
          setSourceText(inputRef.current.textContent);
          onTranslate(inputRef.current.textContent, sourceLang, targetLang);
        }, 1000); // set a new timer to run the translation 1 second after the user stops typing
      }
    };
  
    const div = inputRef.current;
    div.addEventListener("input", handleInput);
  
    return () => {
      div.removeEventListener("input", handleInput);
      if (timerId) {
        clearTimeout(timerId); // clear the timer when the component unmounts
      }
    };
  }, [sourceLang, targetLang, onTranslate]);

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    inputRef.current.textContent = translation;
    onTranslate(sourceText, targetLang, sourceLang);
  };

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
          onChange={(e) => {
            setSourceLang(e.target.value)
            onTranslate(sourceText, e.target.value, targetLang)}}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {iso6393.find((l) => l.iso6393 === lang).name}
            </option>
          ))}
        </select>
        <button className="tts-button" onClick={swapLanguages}><FaArrowRightArrowLeft/></button>
        <select
          value={targetLang}
          onChange={(e) => {
            setTargetLang(e.target.value)
            onTranslate(sourceText, sourceLang, e.target.value)}}
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
              disabled={sourceText === "" || !ttsLanguages.includes(sourceLang)}
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
              disabled={!translation || !ttsLanguages.includes(targetLang)}
              onClick={() => onTts(translation, targetLang, setIsAudioPlaying)}
            >
              {isAudioPlaying ? <FaStop /> : <FaVolumeLow />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default TranslationForm;
