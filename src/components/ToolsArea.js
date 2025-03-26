import React, { useState } from "react";
import { FaVolumeLow, FaStop, FaCopy } from "react-icons/fa6";

function ToolsArea({ text, lang, onTts, ttsLanguages, inTranslation }) {
    const [audio, setAudio] = useState(null);
    const [isTtsClicked, setIsTtsClicked] = useState(false);
    const [isCopyClicked, setIsCopyClicked] = useState(false);

    const isTtsDisabled = !ttsLanguages.includes(lang) || !text?.trim();

    const handleTtsClick = async () => {
        setIsTtsClicked(true);
        setTimeout(() => setIsTtsClicked(false), 200); // Reset after 200ms

        if (audio) {
            audio.pause();
            setAudio(null);
            return;
        }

        const newAudio = await onTts(text, lang);
        newAudio.onended = () => setAudio(null);
        setAudio(newAudio);
    };

    const copyToClipboard = () => {
        setIsCopyClicked(true);
        setTimeout(() => setIsCopyClicked(false), 200); // Reset after 200ms

        const textArea = document.createElement('textarea');
        textArea.disabled = true;
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }

        document.body.removeChild(textArea);

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(err => console.error('Async: Could not copy text: ', err));
        }
    };

    return (
        <div className="tools-area">
            <button
                className={`tts-button ${isTtsClicked ? "clicked" : ""}`}
                onClick={handleTtsClick}
                disabled={isTtsDisabled}
            >
                {audio ? <FaStop /> : <FaVolumeLow />}
            </button>
            <button
                className={`copy-button ${isCopyClicked ? "clicked" : ""}`}
                onClick={copyToClipboard}
                disabled={!text}
            >
                <FaCopy />
            </button>
        </div>
    );
}

export default ToolsArea;