import React from "react";
import { useTranslation } from "react-i18next";
import komiFlag from "../assets/flags/komi.svg";
import udmurtiaFlag from "../assets/flags/udmurtia.svg";
import ukFlag from "../assets/flags/uk.svg";
import russiaFlag from "../assets/flags/russia.svg";

function LocaleSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <div className="locale-switcher">
      <button
        className={i18n.language === "kv" ? "active" : ""}
        onClick={() => changeLanguage("kv")}
      >
        <img src={komiFlag} alt="" />
      </button>
      <button
        className={i18n.language === "udm" ? "active" : ""}
        onClick={() => changeLanguage("udm")}
      >
        <img src={udmurtiaFlag} alt="" />
      </button>
      <button
        className={i18n.language === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        <img src={ukFlag} alt="" />
      </button>
      <button
        className={i18n.language === "ru" ? "active" : ""}
        onClick={() => changeLanguage("ru")}
      >
        <img src={russiaFlag} alt="" />
      </button>
    </div>
  );
}

export default LocaleSwitcher;
