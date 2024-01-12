// src/App.js

import React, { useState, useEffect } from "react";
import TranslationForm from "./components/TranslationForm";
import "./App.css";

function App() {
  const [translation, setTranslation] = useState("");
  const [translationVariants, setTranslationVariants] = useState([]);
  const [languages, setLanguages] = useState([
    "eng",
    "fin",
    "rus",
    "est",
    "kpv",
  ]);
  const [ttsLanguages, setTtsLanguages] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    getTranslationLanguages();
    getTtsLanguages();
  }, []);

  const handleTranslation = async (text, src, tgt) => {
    if (text === "") {
      setTranslation("");
      setTranslationVariants([]);
      return;
    }
    
    try {
      const response = await fetch(
        "https://api-majbyr-translate.rahtiapp.fi/translate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            src,
            tgt,
          }),
        }
      );
      const data = await response.json();
      setTranslation(data.result);
      setTranslationVariants(data.alternatives);
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslation("Failed to translate text.");
    }
  };

  const handleTts = async (text, lang, setIsAudioPlaying) => {
    try {
      // Construct the URL with query parameters
      const url = new URL("https://api-majbyr-translate.rahtiapp.fi/tts/");
      url.searchParams.append("text", text);
      url.searchParams.append("lang", lang);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Response from TTS service was not okay");
      }

      // The response is an audio stream. We need to convert it to a blob.
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      // Create a new HTMLAudioElement and play the audio
      const audio = new Audio(audioUrl);
      setIsAudioPlaying(true);

      audio.onended = () => {
        setIsAudioPlaying(false);
      };
      audio.play();
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setIsAudioPlaying(false);
    }
  };

  // get translation languages from api
  const getTranslationLanguages = async () => {
    try {
      const response = await fetch(
        "https://api-majbyr-translate.rahtiapp.fi/translation_languages/"
      );
      const data = await response.json();
      setLanguages(data.languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const getTtsLanguages = async () => {
    try {
      const response = await fetch(
        "https://api-majbyr-translate.rahtiapp.fi/tts_languages/"
      );
      const data = await response.json();
      setTtsLanguages(data.languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  return (
    <div className="App">
      <h1>Majbyr translate</h1>
      <TranslationForm
        onTranslate={handleTranslation}
        onTts={(text, lang) => handleTts(text, lang, setIsAudioPlaying)}
        languages={languages}
        ttsLanguages={ttsLanguages}
        translation={translation}
        translationVariants={translationVariants}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
      />
    </div>
  );
}

export default App;
