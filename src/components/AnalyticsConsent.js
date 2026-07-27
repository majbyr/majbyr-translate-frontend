import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAnalyticsConsent, setAnalyticsConsent } from "../analytics";

const COPY = {
  en: {
    text: "Help improve Majbyr by sharing anonymous usage counts",
    accept: "Share",
    decline: "No",
  },
  ru: {
    text: "Разрешить собирать анонимную статистику со страницы?",
    accept: "Разрешить",
    decline: "Нет",
  },
  kv: {
    text: "Юксьыны-ӧ анономнӧй статистикаӧн?",
    accept: "Юксьыны",
    decline: "Эн",
  },
  udm: {
    text: "Лэзёно-а бамысь анонимное статистика люканы?",
    accept: "Лэзьыны",
    decline: "Уг",
  },
};

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(() => getAnalyticsConsent());
  const { i18n } = useTranslation();
  if (choice !== null) return null;

  const language = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const copy = COPY[language] || COPY.en;
  const choose = value => {
    setAnalyticsConsent(value);
    setChoice(value);
  };

  return (
    <aside className="analytics-consent" data-testid="analytics-consent" role="dialog" aria-live="polite" aria-label="Usage statistics preference">
      <div className="analytics-consent-inner">
        <p>{copy.text}</p>
        <div className="analytics-consent-actions">
          <button type="button" className="analytics-consent-decline" onClick={() => choose("denied")}>{copy.decline}</button>
          <button type="button" className="analytics-consent-accept" onClick={() => choose("granted")}>{copy.accept}</button>
        </div>
      </div>
      <style>{`
        .analytics-consent { position: fixed; z-index: 1000; left: 0; right: 0; bottom: 0; box-sizing: border-box; width: 100%; padding: .85rem 1rem; border-top: 1px solid rgba(255,255,255,.1); background: rgba(24,24,27,.97); color: #fff; box-shadow: 0 -8px 28px rgba(0,0,0,.22); }
        .analytics-consent-inner { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; width: 100%; max-width: 80rem; margin: 0 auto; }
        .analytics-consent p { margin: 0; font-size: .86rem; line-height: 1.45; color: #e4e4e7; }
        .analytics-consent-actions { display: flex; flex-shrink: 0; align-items: center; gap: 1rem; }
        .analytics-consent .analytics-consent-accept { padding: .5rem 1rem; border: 1px solid var(--accent-color); border-radius: .45rem; background: var(--accent-color); color: #fff; font-size: .85rem; font-weight: 600; cursor: pointer; }
        .analytics-consent .analytics-consent-accept:hover { background: #8b1d1d; border-color: #8b1d1d; color: #fff; }
        .analytics-consent .analytics-consent-decline { padding: 0; border: 0; background: transparent; color: #d4d4d8; font-size: .85rem; cursor: pointer; text-decoration: none; text-underline-offset: .25rem; }
        .analytics-consent .analytics-consent-decline:hover, .analytics-consent .analytics-consent-decline:focus { background: transparent; color: #fff; text-decoration: underline; }
        @media (max-width: 600px) { .analytics-consent-inner { align-items: flex-start; flex-direction: column; gap: .7rem; } }
      `}</style>
    </aside>
  );
}
