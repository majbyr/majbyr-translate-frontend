// src/components/TextEditorArea.js

import React, { useEffect, useRef, useState } from "react";
import ToolsArea from "./ToolsArea";
import { useTranslation } from "react-i18next";

function TextEditorArea({
  inputRef,
  textareaRef,  // Add this prop
  sourceText,
  setSourceText,
  onTts,
  sourceLang,
  targetLang,
  onTranslate,
  isAudioPlaying,
  setIsAudioPlaying,
  ttsLanguages,
}) {
  const { t } = useTranslation();
  const [debounceTimer, setDebounceTimer] = useState(null);

  const splitIntoSentences = (text) => {
    // Split on period followed by space or end of string, question mark, or exclamation mark
    return text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [];
  };

  const handleKeyDown = (event) => {
    const blockedKeys = ["b", "i", "u"];
    if ((event.metaKey || event.ctrlKey) && blockedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleTextareaChange = (event) => {
    if (inputRef.current) {
      const newText = event.target.value;
      // Convert line breaks to div elements and preserve exact whitespace
      const formattedText = newText.split('\n').map(line => {
        if (line.trim() === '') {
          return '<div><br></div>';
        }
        
        // Split into sentences but maintain original spacing
        const sentences = splitIntoSentences(line);
        let currentPosition = 0;
        const formattedSentences = sentences.map(sentence => {
          // Find the exact position of this sentence in the original line
          const sentenceStart = line.indexOf(sentence, currentPosition);
          const leadingSpaces = line.substring(currentPosition, sentenceStart);
          currentPosition = sentenceStart + sentence.length;
          
          // Preserve exact whitespace using non-breaking spaces
          const preservedSpaces = leadingSpaces.replace(/ /g, '&nbsp;');
          return preservedSpaces + `<span data-sentence>${sentence}</span>`;
        }).join('');
        
        return `<div style="white-space: pre-wrap;">${formattedSentences}</div>`;
      }).join('');

      inputRef.current.innerHTML = formattedText;
      setSourceText(newText);

      if (debounceTimer) clearTimeout(debounceTimer);

      // If text is longer than 100 characters, use debounce
      if (newText.length > 100) {
        const timer = setTimeout(() => {
          onTranslate(newText, sourceLang, targetLang);
        }, 500);
        setDebounceTimer(timer);
      } else {
        onTranslate(newText, sourceLang, targetLang);
      }
    }
  };

  useEffect(() => {
    const div = inputRef.current;
    div.addEventListener("keydown", handleKeyDown);

    return () => {
      div.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  useEffect(() => {
    const sourceDiv = inputRef.current;
    const textarea = textareaRef.current;

    const syncFontStyles = () => {
      const computedStyle = window.getComputedStyle(sourceDiv);
      textarea.style.fontSize = computedStyle.fontSize;
      textarea.style.lineHeight = computedStyle.lineHeight;
    };

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      textarea.style.width = `${width}px`;
      textarea.style.height = `${height}px`;
      syncFontStyles();
    });

    resizeObserver.observe(sourceDiv);
    syncFontStyles();

    return () => resizeObserver.disconnect();
  }, [inputRef]);

  return (
    <div className="input-area" style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        className="source-text-overlay"
        onChange={handleTextareaChange}
        defaultValue=""
        placeholder={t("Enter text to translate")}
      />
      <div
        className="source-text"
        ref={inputRef}
      ></div>
      <ToolsArea
        text={sourceText}
        lang={sourceLang}
        isAudioPlaying={isAudioPlaying}
        onTts={onTts}
        setIsAudioPlaying={setIsAudioPlaying}
        isTtsDisabled={true}
        ttsLanguages={ttsLanguages}
      />
    </div>
  );
}

export default TextEditorArea;
