// src/components/TranslationArea.js

import React from "react";
import SentenceElement from "./SentenceElement";
import ToolsArea from "./ToolsArea";

function TranslationArea({
  translatedSentences,
  targetLang,
  isAudioPlaying,
  onTts,
  setIsAudioPlaying,
  isTtsDisabled,
  ttsLanguages,
}) {

  return (
    <div className="translation-area">
      <div className="translationText">
        {translatedSentences.map((paragraph, paragraphIndex) => (
          <div className="paragraph" key={paragraphIndex}>
            {paragraph.map((translationVariants, sentenceIndex) => (
              <SentenceElement
                sentence={translationVariants[0]}
                variants={translationVariants}
                key={sentenceIndex}
              />
            ))}
          </div>
        ))}
      </div>
      <ToolsArea
        text={(translatedSentences.map((paragraph) => paragraph.map((translationVariants) => translationVariants[0])).flat()).join(" ")}
        lang={targetLang}
        isAudioPlaying={isAudioPlaying}
        onTts={onTts}
        setIsAudioPlaying={setIsAudioPlaying}
        isTtsDisabled={isTtsDisabled}
        ttsLanguages={ttsLanguages}
        inTranslation={true}
      />
    </div>
  );
}

export default TranslationArea;
