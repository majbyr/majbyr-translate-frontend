// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { iso6393 } from "iso-639-3";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import TextEditorArea from "./TextEditorArea";
import TranslationArea from "./TranslationArea";

function TranslationForm({
  onTranslate,
  onTts,
  languages,
  ttsLanguages,
  translatedSentences,
  isAudioPlaying,
  setIsAudioPlaying,
}) {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("kpv");
  const [targetLang, setTargetLang] = useState("eng");
  const inputRef = useRef(null);

  useEffect(() => {
    let timerId;

    const handleInput = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        const inputText = inputRef.current.textContent;
        setSourceText(inputText);
        onTranslate(inputText, sourceLang, targetLang);
      }, 500);
    };

    const div = inputRef.current;
    div.addEventListener("input", handleInput);

    return () => {
      div.removeEventListener("input", handleInput);
      clearTimeout(timerId);
    };
  }, [sourceLang, targetLang, onTranslate]);

  

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    const newSourceText = document.getElementsByClassName("translationText")[0].innerText;
    setSourceText(newSourceText);
    inputRef.current.textContent = newSourceText;
  };

  const handleSelectChange = (setter, isSourceLang) => (e) => {
    const newLang = e.target.value;
    setter(newLang);
  
    if (isSourceLang) {
      onTranslate(sourceText, newLang, targetLang);
    } else {
      onTranslate(sourceText, sourceLang, newLang);
    }
  };

  const LanguageOption = ({ lang }) => {
    const languageName = iso6393.find((l) => l.iso6393 === lang).name;
    return <option value={lang}>{languageName}</option>;
  };

  const isTtsDisabled = (lang) => !ttsLanguages.includes(lang);

  return (
    <div className="translation-form">
      <div className="language-selectors">
        <select value={sourceLang} onChange={handleSelectChange(setSourceLang, true)}>
          {languages.map((lang) => <LanguageOption key={lang} lang={lang} />)}
        </select>
        <button className="tts-button" onClick={swapLanguages}>
          <FaArrowRightArrowLeft />
        </button>
        <select value={targetLang} onChange={handleSelectChange(setTargetLang, false)}>
          {languages.map((lang) => <LanguageOption key={lang} lang={lang} />)}
        </select>
      </div>
      <div className="text-areas">
        <TextEditorArea
          inputRef={inputRef}
          sourceText={sourceText}
          ttsLanguages={ttsLanguages}
          sourceLang={sourceLang}
          isAudioPlaying={isAudioPlaying}
          onTts={onTts}
          setIsAudioPlaying={setIsAudioPlaying}
          isTtsDisabled={isTtsDisabled}
        />
        <TranslationArea
          translatedSentences={sourceText.trim() ? translatedSentences : []}
          targetLang={targetLang}
          ttsLanguages={ttsLanguages}
          isAudioPlaying={isAudioPlaying}
          onTts={onTts}
          setIsAudioPlaying={setIsAudioPlaying}
          isTtsDisabled={isTtsDisabled}
        ></TranslationArea>
      </div>
    </div>
  );
}

export default TranslationForm;
