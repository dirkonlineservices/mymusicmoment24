import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Sprachauswahl / Language Selection"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("de")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === "de"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
            : "text-slate-400 hover:text-white"
        }`}
        aria-pressed={language === "de"}
        aria-label="Deutsch"
      >
        <span className="text-xs">🇩🇪</span>
        <span>DE</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20"
            : "text-slate-400 hover:text-white"
        }`}
        aria-pressed={language === "en"}
        aria-label="English"
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
