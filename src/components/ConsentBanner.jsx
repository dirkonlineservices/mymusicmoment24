import React, { useState, useEffect } from "react";
import { ShieldCheck, Settings, X, Check } from "lucide-react";
import { updateConsent } from "../lib/gtmPreview";

export default function ConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("mmm24_cookie_consent");
    if (!saved) {
      // Show banner after brief delay
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

    // Listener for footer button "Cookie-Einstellungen"
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
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">Privatsphäre & Datenschutz</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Wir nutzen Cookies und Tracking-Technologien (Google Consent Mode v2), um unsere Webseite zu optimieren, 
            Hörproben bereitzustellen und dir personalisierte Angebote zu präsentieren.
          </p>

          {showSettings && (
            <div className="mb-4 space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Technisch Notwendig</span>
                  <span className="text-xs text-slate-400">Erforderlich für Navigation, Warenkorb & Checkout.</span>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="rounded bg-slate-700 border-slate-600 text-orange-500 cursor-not-allowed w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div>
                  <span className="font-semibold text-white block">Statistiken & Analyse</span>
                  <span className="text-xs text-slate-400">Hilft uns zu verstehen, welche Lieder am beliebtesten sind.</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div>
                  <span className="font-semibold text-white block">Marketing & Personalisierung</span>
                  <span className="text-xs text-slate-400">Ermöglicht personalisierte Empfehlungen auf Partnerseiten.</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 items-center">
            {showSettings ? (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white text-sm"
                >
                  Zurück
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-orange-500/20"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition border border-slate-700"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3 py-2 text-slate-400 hover:text-white text-sm flex items-center gap-1.5 transition ml-auto"
                >
                  <Settings className="w-4 h-4" />
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
