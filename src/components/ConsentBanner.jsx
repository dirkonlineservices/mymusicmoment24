import React, { useState, useEffect } from "react";
import { ShieldCheck, Settings, X, Check } from "lucide-react";
import { updateConsent } from "../lib/gtmPreview";
import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY = "mmm24_cookie_consent";

// Bei Widerruf bereits gesetzte Google-Cookies entfernen (_ga*, _gcl*)
function removeCookies(prefixes) {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0].trim();
    if (!prefixes.some((p) => name.startsWith(p))) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}

export default function ConsentBanner() {
  const { t, lp } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      saved = null;
    }
    if (!saved) {
      // Erster Besuch: Banner sofort zeigen, Consent bleibt bis zur Entscheidung "denied"
      setIsOpen(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ essential: true, analytics: Boolean(parsed.analytics), marketing: Boolean(parsed.marketing) });
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, savedAt: new Date().toISOString() }));
    } catch (e) {
      // Ohne Speicher gilt die Wahl nur für diesen Seitenaufruf
    }
    setPreferences(settings);
    updateConsent(settings);
    if (!settings.analytics) removeCookies(["_ga"]);
    if (!settings.marketing) removeCookies(["_gcl"]);
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
      aria-label={t("cookieBanner.title", "Cookie- und Datenschutzeinstellungen")}
      className="fixed bottom-3 left-3 right-3 md:left-auto md:right-6 md:max-w-xl z-50 bg-white/95 border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 text-stone-900"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2 sm:p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 shrink-0">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
            {t("cookieBanner.title", "Privatsphäre & Datenschutz")}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3 sm:mb-4">
            {t(
              "cookieBanner.desc",
              "Ich nutze Cookies und Tracking-Technologien (Google Consent Mode v2), um die Website zu optimieren, Hörproben bereitzustellen und dir ein erstklassiges Nutzungserlebnis zu bieten."
            )}
          </p>

          {showSettings && (
            <div className="mb-3.5 space-y-2.5 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900 block">
                    {t("cookieBanner.essential", "Technisch Notwendig")}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {t("cookieBanner.essentialDesc", "Erforderlich für Warenkorb, Abspielgerät & Kasse.")}
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="cookie-consent-essential"
                  checked
                  disabled
                  aria-label="Technisch notwendige Cookies (immer aktiv)"
                  className="rounded bg-stone-200 border-stone-300 text-amber-500 cursor-not-allowed w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <label htmlFor="cookie-consent-analytics" className="cursor-pointer">
                  <span className="font-semibold text-stone-900 block">
                    {t("cookieBanner.analytics", "Statistiken & Analyse")}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {t("cookieBanner.analyticsDesc", "Hilft mir zu verstehen, welche Musikrichtungen am beliebtesten sind.")}
                  </span>
                </label>
                <input
                  type="checkbox"
                  id="cookie-consent-analytics"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  aria-label="Statistiken und Analyse Cookies erlauben"
                  className="rounded bg-white border-stone-300 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <label htmlFor="cookie-consent-marketing" className="cursor-pointer">
                  <span className="font-semibold text-stone-900 block">
                    {t("cookieBanner.marketing", "Marketing & Personalisierung")}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {t("cookieBanner.marketingDesc", "Ermöglicht zielgerichtete Empfehlungen auf Partnerplattformen.")}
                  </span>
                </label>
                <input
                  type="checkbox"
                  id="cookie-consent-marketing"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  aria-label="Marketing und Personalisierung Cookies erlauben"
                  className="rounded bg-white border-stone-300 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            {showSettings ? (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm"
                >
                  {t("cookieBanner.save", "Auswahl speichern")}
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 text-xs sm:text-sm"
                >
                  {t("cookieBanner.back", "Zurück")}
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    onClick={handleRejectAll}
                    className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs sm:text-sm font-bold transition"
                  >
                    {t("cookieBanner.rejectAll", "Nur notwendige")}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs sm:text-sm font-bold transition"
                  >
                    {t("cookieBanner.acceptAll", "Alle akzeptieren")}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-1 underline decoration-dotted hover:text-stone-800 transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t("cookieBanner.settings", "Einstellungen")}</span>
                  </button>
                  <a href={lp("/datenschutz")} className="underline decoration-dotted hover:text-stone-800 transition">
                    {t("cookieBanner.privacyLink", "Datenschutzerklärung")}
                  </a>
                  <a href={lp("/impressum")} className="underline decoration-dotted hover:text-stone-800 transition">
                    {t("cookieBanner.imprintLink", "Impressum")}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
