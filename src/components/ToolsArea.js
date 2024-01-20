// src/components/ToolsArea.js

import React, { useState } from "react";
import { FaVolumeLow, FaStop } from "react-icons/fa6";

function ToolsArea({
  text,
  lang,
  onTts,
  ttsLanguages,
}) {
    const isTtsDisabled = ttsLanguages === null || !ttsLanguages.includes(lang) || !text.trim();
    const [audio, setAudio] = useState(null);

  return (
    <div className="tools-area">
      <button
        className="tts-button"
        onClick={async () => {
            if (audio) {
                audio.pause();
                setAudio(null);
                return;
            }
            const text = document.querySelector(".translationText").innerText;
            const a = await onTts(text, lang);
            a.onended = () => (setAudio(null));
            setAudio(a);
        }} disabled={isTtsDisabled}
      >
        {audio ? <FaStop /> : <FaVolumeLow />}
      </button>
    </div>
  );
}

export default ToolsArea;
