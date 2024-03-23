import React, { useState } from "react";
import { FaVolumeLow, FaStop, FaCopy } from "react-icons/fa6";

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

    const copyToClipboard = () => {
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
            <button className="tts-button" onClick={handleTtsClick} disabled={isTtsDisabled}>
                {audio ? <FaStop /> : <FaVolumeLow />}
            </button>
            <button className="copy-button" onClick={copyToClipboard} disabled={!text}>
                <FaCopy />
            </button>
        </div>
    );
}

export default ToolsArea;
