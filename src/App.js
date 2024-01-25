// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import TranslationForm from "./components/TranslationForm";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./App.css";

import "./i18n";

function App() {
  
  const { t } = useTranslation();

  const [translatedSentences, setTranslatedSentences] = useState([]);
  const [languages, setLanguages] = useState(null);
  const [ttsLanguages, setTtsLanguages] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  useEffect(() => {
    document.querySelector('meta[name="description"]').setAttribute("content", t('description'));
  }, [t]);

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      await getTranslationLanguages();
      await getTtsLanguages();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleComplexTranslation = async (text, src, tgt) => {
    if (text.trim() === "") {
      setTranslatedSentences([]);
      return;
    }
    try {
      const response = await fetch(
        "https://api-majbyr-translate.rahtiapp.fi/translate_complex/",
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
      setTranslatedSentences(data.translations);
    } catch (error) {
      setTranslatedSentences([[[t("Failed to translate")]]]);
    }
  };

  const handleTts = async (text, lang, setIsAudioPlaying) => {
    if (text.trim() === "") {
      return;
    }
    try {
      // Construct the URL with query parameters
      const url = new URL("https://api-majbyr-translate.rahtiapp.fi/tts/");
      url.searchParams.append("text", text);
      url.searchParams.append("lang", lang);
      setIsAudioPlaying(true);
      const response = await fetch(url);
      if (!response.ok) {
        setIsAudioPlaying(false);
        throw new Error("Response from TTS service was not okay");
      }

      // The response is an audio stream. We need to convert it to a blob.
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      // Create a new HTMLAudioElement and play the audio
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsAudioPlaying(false);
      };
      audio.play();
      return audio;
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

  if (isLoading) {
    return;
  }

  return (
    <Router>
      <div className="App">
        <h1>{t('app')}</h1>
        <LanguageSwitcher />
        <Routes>
          <Route
            path="/:src/:tgt"
            element={
              <TranslationForm
                onTranslate={handleComplexTranslation}
                onTts={(text, lang) => handleTts(text, lang, setIsAudioPlaying)}
                languages={languages}
                ttsLanguages={ttsLanguages}
                translatedSentences={translatedSentences}
                isAudioPlaying={isAudioPlaying}
                setIsAudioPlaying={setIsAudioPlaying}
              />
            }
          />
          <Route
            path="/"
            element={
              <TranslationForm
                onTranslate={handleComplexTranslation}
                onTts={(text, lang) => handleTts(text, lang, setIsAudioPlaying)}
                languages={languages}
                ttsLanguages={ttsLanguages}
                translatedSentences={translatedSentences}
                isAudioPlaying={isAudioPlaying}
                setIsAudioPlaying={setIsAudioPlaying}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
