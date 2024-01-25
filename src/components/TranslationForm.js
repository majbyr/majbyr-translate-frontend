// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
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
  const { t } = useTranslation();

  const [sourceText, setSourceText] = useState("");
  const { src, tgt } = useParams();
  const [sourceLang, setSourceLang] = useState(src || "eng");
  const [targetLang, setTargetLang] = useState(tgt || "kpv");
  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (src) {
      setSourceLang(src);
    }
    if (tgt) {
      setTargetLang(tgt);
    }
  }, [src, tgt]);


  useEffect(() => {
    navigate(`/${sourceLang}/${targetLang}`);
  }, 
  [sourceLang, targetLang, navigate]);

  useEffect(() => {
    let timerId;

    const handleInput = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        const inputText = inputRef.current.innerText;
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
    const newSourceText =
      document.getElementsByClassName("translationText")[0].innerText;
    setSourceText(newSourceText);
    inputRef.current.innerText = newSourceText;
    onTranslate(newSourceText, targetLang, sourceLang);
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
    const languageName = t(lang)
    return <option value={lang}>{languageName}</option>;
  };

  const isTtsDisabled = (lang) => !ttsLanguages.includes(lang);

  return (
    <div className="translation-form">
      <div className="language-selectors">
        <select
          value={sourceLang}
          onChange={handleSelectChange(setSourceLang, true)}
        >
          {languages.map((lang) => (
            <LanguageOption key={lang} lang={lang} />
          ))}
        </select>
        <button className="tts-button" onClick={swapLanguages}>
          <FaArrowRightArrowLeft />
        </button>
        <select
          value={targetLang}
          onChange={handleSelectChange(setTargetLang, false)}
        >
          {languages.map((lang) => (
            <LanguageOption key={lang} lang={lang} />
          ))}
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