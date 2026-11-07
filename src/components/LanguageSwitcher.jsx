import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, altHref } = useLanguage();
  // Echte Links (Google findet so die andere Sprache); normaler Klick wechselt ohne Neuladen
  const handleClick = (lang) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setLanguage(lang);
  };

  return (
    <div
      role="group"
      aria-label="Sprachauswahl / Language Selection"
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-white/95 border border-stone-200 hover:border-amber-400 backdrop-blur-xl shadow-lg shadow-stone-300/40 transition-all duration-300 ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-amber-500 ml-1.5 mr-0.5 shrink-0 hidden xs:inline" />
      <a
        href={altHref("de")}
        hrefLang="de"
        onClick={handleClick("de")}
        className={`flex items-center justify-center gap-1 min-w-[3.25rem] px-2.5 py-1 rounded-xl text-xs font-black transition-colors duration-200 ${
          language === "de"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
        }`}
        aria-current={language === "de" ? "true" : undefined}
        title="Deutsch"
      >
        <span className="text-xs">🇩🇪</span>
        <span>DE</span>
      </a>

      <a
        href={altHref("en")}
        hrefLang="en"
        onClick={handleClick("en")}
        className={`flex items-center justify-center gap-1 min-w-[3.25rem] px-2.5 py-1 rounded-xl text-xs font-black transition-colors duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
        }`}
        aria-current={language === "en" ? "true" : undefined}
        title="English"
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </a>
    </div>
  );
}
