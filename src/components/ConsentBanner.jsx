import React, { useState, useEffect } from "react";
import { ShieldCheck, Settings, X, Check } from "lucide-react";
import { updateConsent } from "../lib/gtmPreview";

export default function ConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("mmm24_cookie_consent");
    if (!saved) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        updateConsent(parsed);
      } catch (e) {
        setIsOpen(true);
      }
    }

    const handleReopen = () => {
      setShowSettings(true);
      setIsOpen(true);
    };
    window.addEventListener("open-cookie-settings", handleReopen);
    return () => window.removeEventListener("open-cookie-settings", handleReopen);
  }, []);

  const saveConsent = (settings) => {
    localStorage.setItem("mmm24_cookie_consent", JSON.stringify(settings));
    setPreferences(settings);
    updateConsent(settings);
    setIsOpen(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Cookie- und Datenschutzeinstellungen"
      className="fixed bottom-3 left-3 right-3 md:left-auto md:right-6 md:max-w-xl z-50 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2 sm:p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">Privatsph\u00e4re & Datenschutz</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 sm:mb-4">
            Wir nutzen Cookies und Tracking-Technologien (Google Consent Mode v2), um unsere Webseite zu optimieren, 
            H\u00f6rproben bereitzustellen und dir ein erstklassiges Nutzungserlebnis zu bieten.
          </p>

          {showSettings && (
            <div className="mb-3.5 space-y-2.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Technisch Notwendig</span>
                  <span className="text-[11px] text-slate-400">Erforderlich f\u00fcr Warenkorb, Abspielger\u00e4t & Kasse.</span>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="rounded bg-slate-700 border-slate-600 text-amber-500 cursor-not-allowed w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div>
                  <span className="font-semibold text-white block">Statistiken & Analyse</span>
                  <span className="text-[11px] text-slate-400">Hilft uns zu verstehen, welche Musikrichtungen am beliebtesten sind.</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div>
                  <span className="font-semibold text-white block">Marketing & Personalisierung</span>
                  <span className="text-[11px] text-slate-400">Erm\u00f6glicht zielgerichtete Empfehlungen auf Partnerplattformen.</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            {showSettings ? (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs sm:text-sm font-bold transition"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white text-xs sm:text-sm"
                >
                  Zur\u00fcck
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-lg text-xs sm:text-sm font-black transition shadow-md shadow-amber-500/20"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition border border-slate-700"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-2.5 py-2 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition ml-auto"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Anpassen</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
