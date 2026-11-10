import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "mosari_lang";

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "en" || saved === "vi" ? saved : "vi";
    } catch {
      return "vi";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn("Could not save language preference:", e);
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  };

  /**
   * Translate a dictionary key, with optional variable interpolation:
   * e.g., t("rooms_left", { n: 3 }) => "Còn 3 phòng trống" / "3 rooms remaining"
   */
  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.vi;
    let text = dict[key] || translations.vi[key] || key;

    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, "g"), params[param]);
    });

    return text;
  };

  /**
   * Select localized field from data object:
   * e.g., localize(roomType, "name") => roomType.name_en when EN, else roomType.name_vi || roomType.name
   */
  const localize = (obj, field) => {
    if (!obj) return "";
    if (lang === "en") {
      return obj[`${field}_en`] || obj[field] || obj[`${field}_vi`] || "";
    }
    return obj[`${field}_vi`] || obj[field] || obj[`${field}_en`] || "";
  };

  /**
   * Format prices according to current locale
   */
  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    if (lang === "en") {
      return new Intl.NumberFormat("en-US").format(num) + " VND";
    }
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        localize,
        formatPrice,
        isEn: lang === "en",
        isVi: lang === "vi"
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

