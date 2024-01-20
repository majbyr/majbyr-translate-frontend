// src/components/TextEditorArea.js

import React from "react";
import ToolsArea from "./ToolsArea";

function TextEditorArea({
  inputRef,
  sourceText,
  onTts,
  sourceLang,
  targetLang,
  isAudioPlaying,
  setIsAudioPlaying,
  isTtsDisabled,
  ttsLanguages,
}) {
  return (
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
