import React, {useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import komiFlag from "../assets/flags/komi.svg";
import udmurtiaFlag from "../assets/flags/udmurtia.svg";
import ukFlag from "../assets/flags/uk.svg";
import russiaFlag from "../assets/flags/russia.svg";

function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (language) => {
    // if language unsupported, fallback to default
    i18n.changeLanguage(language);
    navigate(`/${language}`);
    localStorage.setItem("language", language);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const locale = searchParams.get('locale');
    if (locale && ['kv', 'udm', 'en', 'ru'].includes(locale)) {
      i18n.changeLanguage(locale);
    }
  }, [location, i18n]);

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
