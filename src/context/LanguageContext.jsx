import { createContext, useContext, useEffect } from "react";
import { translations } from "../i18n/translations";
import { localizePath, alternatePath } from "../lib/i18nRoutes";

const LanguageContext = createContext();

/**
 * Die Sprache ergibt sich aus der Adresse (/en = Englisch). App und Server geben sie als
 * "language" herein; "onChangeLanguage" wechselt zur Adresse in der anderen Sprache.
 */
export function LanguageProvider({ children, language: languageProp = "de", onChangeLanguage, path = "/" }) {
  const language = languageProp === "en" ? "en" : "de";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang) => {
    if ((lang === "de" || lang === "en") && lang !== language && onChangeLanguage) {
      onChangeLanguage(lang);
    }
  };

  // Interner (deutscher) Pfad → Adresse in der aktuellen Sprache, z. B. lp("/impressum") = "/en/legal-notice"
  const lp = (internalPath) => localizePath(internalPath, language);
  // Adresse der aktuellen Seite in einer Sprache (für den Umschalter)
  const altHref = (lang) => (lang === language ? path : alternatePath(path, lang) || localizePath("/", lang));

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
    <LanguageContext.Provider value={{ language, setLanguage, t, lp, altHref }}>
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
