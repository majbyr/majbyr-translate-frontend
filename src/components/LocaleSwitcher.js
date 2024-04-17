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
    localStorage.setItem("language", language);
    if (language !== i18n.language) {
      navigate(`/${language}`);
    }
  };

  function setLanguage(language) {
    if (['kv', 'udm', 'en', 'ru'].includes(language)) {
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
    }
  }
  
  useEffect(() => {
    const pathLocations = location.pathname.split("/");
    const pathLanguage = pathLocations.length === 2 ? pathLocations[1] : null;
    const searchParams = new URLSearchParams(location.search);
    const queryLanguage = searchParams.get('locale');
  
    // Prefer language setting from the path over the query parameter
    setLanguage(pathLanguage || queryLanguage);
  }, 
  // eslint-disable-next-line
  [location, i18n]);

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
