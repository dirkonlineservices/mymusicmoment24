import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mmm24_lang");
      if (saved === "de" || saved === "en") return saved;
      const browserLang = navigator.language?.toLowerCase() || "";
      if (browserLang.startsWith("en")) return "en";
    }
    return "de";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mmm24_lang", language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === "de" || lang === "en") {
      setLanguageState(lang);
    }
  };

  /**
   * Helper to look up translation by dot-path (e.g. 'nav.shop')
   */
  const t = (path, fallback = "") => {
    const dict = translations[language] || translations.de;
    const parts = path.split(".");
    let current = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        // Fallback to German if not found in target language
        let fallbackCurrent = translations.de;
        for (const p of parts) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && p in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[p];
          } else {
            return fallback || path;
          }
        }
        return fallbackCurrent || fallback || path;
      }
    }

    return current || fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
