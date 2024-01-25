import React, { useState } from "react";
import { FaVolumeLow, FaStop } from "react-icons/fa6";

function ToolsArea({ text, lang, onTts, ttsLanguages, inTranslation }) {
    const [audio, setAudio] = useState(null);

    // Determine if TTS is disabled
    const isTtsDisabled = !ttsLanguages.includes(lang) || !text?.trim();

    // Handler for the TTS button
    const handleTtsClick = async () => {
        if (audio) {
            audio.pause();
            setAudio(null);
            return;
        }

        const newAudio = await onTts(text, lang);
        newAudio.onended = () => setAudio(null);
        setAudio(newAudio);
    };

    return (
        <div className="tools-area">
            <button className="tts-button" onClick={handleTtsClick} disabled={isTtsDisabled}>
                {audio ? <FaStop /> : <FaVolumeLow />}
            </button>
        </div>
    );
}

export default ToolsArea;
