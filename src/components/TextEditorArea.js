// src/components/TextEditorArea.js

import React from "react";
import ToolsArea from "./ToolsArea";
import { useTranslation } from 'react-i18next';

function TextEditorArea({
  inputRef,
  sourceText,
  onTts,
  sourceLang,
  isAudioPlaying,
  setIsAudioPlaying,
  ttsLanguages,
}) {

  const { t } = useTranslation();

  return (
    <div className="input-area">
      <div
        className="sourceText"
        ref={inputRef}
        contentEditable="plaintext-only"
        placeholder={t("Enter text to translate")}
        suppressContentEditableWarning={true}
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
