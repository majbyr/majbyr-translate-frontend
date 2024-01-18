// src/components/TranslationForm.js

import React, { useState, useRef, useEffect } from "react";
import { iso6393 } from "iso-639-3";
import { FaVolumeLow, FaStop, FaArrowRightArrowLeft } from "react-icons/fa6";

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
  const [selectedSentence, setSelectedSentence] = useState(null);

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
        }, 500); // set a new timer to run the translation 1 second after the user stops typing
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.classList.contains("translatedSentence")) {
        setSelectedSentence(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    inputRef.current.textContent = document.getElementsByClassName("translationText")[0].innerText
    setSourceText(inputRef.current.textContent)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onTranslate(sourceText, sourceLang, targetLang);
    //setShowVariantsFlag(false); // Reset the show variants flag on a new translation
  };

  const toggleVariants = (sentence, paragraphIndex, sentenceIndex) => () => {
    if (
      selectedSentence &&
      selectedSentence.paragraphIndex === paragraphIndex &&
      selectedSentence.sentenceIndex === sentenceIndex
    ) {
      setSelectedSentence(null);
    } else {
      setSelectedSentence({
        paragraphIndex,
        sentenceIndex,
        sentence: sentence.slice(1),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="translation-form">
      <div className="language-selectors">
        <select
          value={sourceLang}
          onChange={(e) => {
            setSourceLang(e.target.value);
            onTranslate(sourceText, e.target.value, targetLang);
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {iso6393.find((l) => l.iso6393 === lang).name}
            </option>
          ))}
        </select>
        <button className="tts-button" onClick={swapLanguages}>
          <FaArrowRightArrowLeft />
        </button>
        <select
          value={targetLang}
          onChange={(e) => {
            setTargetLang(e.target.value);
            onTranslate(sourceText, sourceLang, e.target.value);
          }}
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
            contentEditable="plaintext-only"
            placeholder="Enter text"
            rows="10"
            cols="50"
            suppressContentEditableWarning={true}
          ></div>
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
            {translatedSentences.map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex}>
                {paragraph.map((sentence, sentenceIndex) => (
                  <React.Fragment key={sentenceIndex}>
                    <span
                      className="translatedSentence"
                      onClick={toggleVariants(
                        sentence,
                        paragraphIndex,
                        sentenceIndex
                      )}
                    >
                      {sentence[0]}
                    </span>{" "}
                    {selectedSentence &&
                      selectedSentence.paragraphIndex === paragraphIndex &&
                      selectedSentence.sentenceIndex === sentenceIndex && (
                        <div className="translation-variants">
                          {selectedSentence.sentence.map((variant, index) => (
                            <div className="variant" key={index}>
                              {variant}
                            </div>
                          ))}
                        </div>
                      )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
          <div className="tools-area">
            <button
              className="tts-button"
              disabled={
                !translatedSentences[0] || !ttsLanguages.includes(targetLang)
              }
              onClick={() =>                
                onTts(document.getElementsByClassName("translationText")[0].innerText, targetLang, setIsAudioPlaying)
              }
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
