import React, { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { activePromo, PRICES, calculatePrice } from "../lib/pricing";

const SEEN_KEY = "mmm24_promo_seen";
const CONSENT_KEY = "mmm24_cookie_consent";

function readStorage(storage, key) {
  try { return window[storage].getItem(key); } catch { return null; }
}
function writeStorage(storage, key, value) {
  try { window[storage].setItem(key, value); } catch {}
}

/** Merkt sich den Code für die Kasse (wird dort automatisch eingetragen) */
export function rememberPromoCode(code) {
  writeStorage("sessionStorage", "mmm24_promo_code", code);
}

/**
 * Kleine Gutschein-Karte unten links. Erscheint erst nach dem Cookie-Banner,
 * nach 20 Sekunden oder halber Seite, einmal pro Besucher. Kein Vollbild-Pop-up.
 */
export default function PromoTeaser() {
  const { t } = useLanguage();
  const promo = activePromo();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!promo || readStorage("localStorage", SEEN_KEY)) return;

    let timer;
    const show = () => {
      // Nicht gleichzeitig mit dem Cookie-Banner zeigen
      if (!readStorage("localStorage", CONSENT_KEY)) return;
      setVisible(true);
      cleanup();
    };
    const onScroll = () => {
      const scrolled = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (scrolled > 0.5) show();
    };
    const cleanup = () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };

    const startedAt = Date.now();
    timer = setInterval(() => {
      if (Date.now() - startedAt > 20000) show();
    }, 1000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);

  if (!promo || !visible) return null;

  const percent = Math.round(promo.rate * 100);
  const reduced = calculatePrice({ kind: "song", discountRate: promo.rate }).toFixed(2).replace(".", ",");
  const until = new Date(promo.validUntil).toLocaleDateString("de-DE", { day: "numeric", month: "numeric" });

  const close = () => {
    writeStorage("localStorage", SEEN_KEY, "1");
    setVisible(false);
  };

  const useCode = () => {
    rememberPromoCode(promo.code);
    close();
    document.getElementById("konfigurator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      role="dialog"
      aria-label={t("home.promoTitle").replace("{n}", percent)}
      className="fixed z-40 left-3 right-3 bottom-20 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm bg-white border border-amber-300 rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-5"
    >
      <button
        type="button"
        onClick={close}
        className="absolute top-3 right-3 p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
        aria-label={t("home.promoClose")}
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5" />
        </span>
        <div>
          <p className="font-black text-stone-900 text-base leading-snug">{t("home.promoTitle").replace("{n}", percent)}</p>
          <p className="text-sm text-stone-600 mt-1">
            {t("home.promoText")
              .replace("{price}", reduced)
              .replace("{old}", PRICES.song.toFixed(2).replace(".", ","))
              .replace("{until}", until)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="px-3 py-2 rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 font-black tracking-wider text-amber-800 text-sm">
          {promo.code}
        </span>
        <button
          type="button"
          onClick={useCode}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-md transition active:scale-95"
        >
          {t("home.promoCta")}
        </button>
      </div>
    </div>
  );
}
