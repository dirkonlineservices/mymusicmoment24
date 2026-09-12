import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Sprachauswahl / Language Selection"
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-900/95 border border-slate-700/80 hover:border-amber-500/50 backdrop-blur-xl shadow-xl shadow-black/40 transition-all duration-300 ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5 shrink-0 hidden xs:inline" />
      <button
        type="button"
        onClick={() => setLanguage("de")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition-all duration-200 ${
          language === "de"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 scale-[1.02]"
            : "text-slate-300 hover:text-white hover:bg-slate-800/80"
        }`}
        aria-pressed={language === "de"}
        title="Deutsch"
      >
        <span className="text-xs">🇩🇪</span>
        <span>DE</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition-all duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 scale-[1.02]"
            : "text-slate-300 hover:text-white hover:bg-slate-800/80"
        }`}
        aria-pressed={language === "en"}
        title="English"
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
