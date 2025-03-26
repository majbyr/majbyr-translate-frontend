// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import TextEditorArea from "./TextEditorArea";
import TranslationArea from "./TranslationArea";
import LanguageSelector from "./LanguageSelector";

function TranslationForm({
  onTranslate,
  onTts,
  languages,
  ttsLanguages,
  translatedSentences,
  setTranslatedSentences,
  isAudioPlaying,
  setIsAudioPlaying,
}) {
  const { t } = useTranslation();
  const [sourceText, setSourceText] = useState("");
  const { src, tgt } = useParams();
  const { locale } = useParams();
  const [sourceLang, setSourceLang] = useState(src || "eng");
  const [targetLang, setTargetLang] = useState(tgt || "kpv");
  const inputRef = useRef(null);
  const translationRef = useRef(null);
  const navigate = useNavigate();
  const latestInputRef = useRef(sourceText);
  const [isRevertClicked, setIsRevertClicked] = useState(false);
  const textareaRef = useRef(null);

  function isBlinkEngine() {
    const isChrome = window.chrome;
    const isOpera =
      typeof navigator.userAgent === "string" &&
      navigator.userAgent.indexOf("OPR") > -1;
    const isEdge = window.StyleMedia;
    return isChrome || isOpera || isEdge;
  }

  const updateTextSizeClass = (text) => {
    const sourceEl = inputRef.current;
    const translationEl = translationRef.current;
    if (!sourceEl || !translationEl) return;

    ['long-text', 'very-long-text'].forEach(cls => {
      sourceEl.classList.remove(cls);
      translationEl.classList.remove(cls);
    });

    if (text.length > 200) {
      sourceEl.classList.add('very-long-text');
      translationEl.classList.add('very-long-text');
    } else if (text.length > 100) {
      sourceEl.classList.add('long-text');
      translationEl.classList.add('long-text');
    }
  };

  useEffect(() => {
    if (src) {
      setSourceLang(src);
    }
    if (tgt) {
      setTargetLang(tgt);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    if (setTranslatedSentences) {
      setTranslatedSentences([]);
    }
    
    onTranslate(sourceText, src, tgt);
  },
  // eslint-disable-next-line
  [src, tgt]);
  
  useEffect(() => {
    if (locale) {
      return;
    }
    navigate(`/${sourceLang}/${targetLang}`);
  }, 
  // eslint-disable-next-line
  [sourceLang, targetLang]);

  useEffect(() => {
    const currentInputRef = inputRef.current;
    if (!currentInputRef) return;
  
    let debounceTimer;
  
    const handleInput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        let inputText = currentInputRef.innerText;
        if (isBlinkEngine) {
          inputText = inputText.replace(/\n{2}/g, "\n");
        }
        latestInputRef.current = inputText;
        setSourceText(inputText);
        onTranslate(inputText, sourceLang, targetLang);
      }, 500);
    };
  
    const handlePaste = (event) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    };
  
    currentInputRef.addEventListener("input", handleInput);
    currentInputRef.addEventListener("paste", handlePaste);
  
    return () => {
      currentInputRef.removeEventListener("input", handleInput);
      currentInputRef.removeEventListener("paste", handlePaste);
      clearTimeout(debounceTimer);
    };
  }, [sourceLang, targetLang, onTranslate, sourceText]);

  useEffect(() => {
    updateTextSizeClass(sourceText);
  }, [sourceText]);

  const swapLanguages = () => {
    setIsRevertClicked(true);
    setTimeout(() => setIsRevertClicked(false), 200);
    
    const newSourceText = translationRef.current.innerText;
    inputRef.current.innerHTML = newSourceText.split('\n').map(line => 
      line.trim() === '' ? '<div><br></div>' : 
      `<div>${line.replace(/^ +/g, match => '&nbsp;'.repeat(match.length))}</div>`
    ).join('');
    
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.value = newSourceText;
      textarea.focus();
      textarea.setSelectionRange(newSourceText.length, newSourceText.length);
    }
    
    setSourceText(newSourceText);
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleSelectChange = (setter, isSourceLang) => (e) => {
    const newLang = e.target.value;
    setter(newLang);
    if (isSourceLang) onTranslate(sourceText, newLang, targetLang);
    else onTranslate(sourceText, sourceLang, newLang);
  };

  const isTtsDisabled = (lang) => !ttsLanguages.includes(lang);

  return (
    <div className="translation-form">
      <div className="language-selectors">
        <LanguageSelector
          selectedLang={sourceLang}
          handleSelectChange={handleSelectChange(setSourceLang, true)}
          setLanguage={setSourceLang}
          languages={languages}
          isSrc={true}
          t={t}
        />
        <button
            className={`revert-languages-button ${isRevertClicked ? "clicked" : ""}`}
            onClick={swapLanguages}
        >
            <FaArrowRightArrowLeft />
        </button>
        <LanguageSelector
          selectedLang={targetLang}
          handleSelectChange={handleSelectChange(setTargetLang, false)}
          setLanguage={setTargetLang}
          languages={languages}
          t={t}
        />
      </div>
      <div className="text-areas">
        <TextEditorArea
          inputRef={inputRef}
          textareaRef={textareaRef}
          sourceText={sourceText}
          setSourceText={setSourceText}
          ttsLanguages={ttsLanguages}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onTranslate={onTranslate}
          isAudioPlaying={isAudioPlaying}
          onTts={onTts}
          setIsAudioPlaying={setIsAudioPlaying}
          isTtsDisabled={isTtsDisabled}
        />
        <TranslationArea
          translationRef={translationRef}
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
