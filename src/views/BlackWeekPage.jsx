import { useState, useEffect } from "react";
import {
  ArrowLeft, Sparkles, Gift, Check, Copy, ShieldCheck, Clock,
  Music, ArrowRight, FileText, MessageCircle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AudioPlayer from "../components/AudioPlayer";
import Configurator from "../components/Configurator";
import PaymentBadges from "../components/PaymentBadges";
import SchemaJsonLd from "../components/SchemaJsonLd";
import { rememberPromoCode } from "../components/PromoTeaser";

const PROMO_CODE = "BLACK25";

export default function BlackWeekPage({ onBackToHome, onOpenCheckout }) {
  const { language, lp } = useLanguage();
  const en = language === "en";
  const [copied, setCopied] = useState(false);

  // 25-%-Rabattcode beim Besuch der Black-Week-Seite automatisch für die Kasse vormerken
  useEffect(() => {
    rememberPromoCode(PROMO_CODE);
  }, []);

  const scrollToConfigurator = (occasion = null) => {
    rememberPromoCode(PROMO_CODE);
    if (occasion && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("preselect-occasion", { detail: { occasion } }));
    }
    const el = document.getElementById("konfigurator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyCode = () => {
    rememberPromoCode(PROMO_CODE);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBuyVoucher = () => {
    rememberPromoCode(PROMO_CODE);
    onOpenCheckout({
      id: `prod-gutschein-${Date.now()}`,
      name: en ? "Gift Voucher for a Custom Song" : "Geschenkgutschein für ein Wunschlied",
      price: 19.99,
      category: "gutschein",
      details: {
        occasion: "gutschein",
        genre: "Wahl beim Einlösen",
        voice: "Wahl beim Einlösen",
        language: en ? "Englisch" : "Deutsch",
        express: false,
        pdfLyrics: false,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 selection:bg-amber-400 selection:text-stone-950">
      <SchemaJsonLd type="home" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href={lp("/")}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              onBackToHome();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>{en ? "Back to home page" : "Zurück zur Startseite"}</span>
          </a>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href={lp("/")}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onBackToHome();
              }}
              className="flex items-center gap-2 text-sm font-bold text-stone-900 hover:opacity-90 transition"
            >
              <img
                src="/images/logo-icon.png"
                alt="MyMusicMoment24 Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="hidden sm:inline">
                MyMusicMoment<span className="text-amber-500">24</span>
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Black Deal Monat Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white py-12 sm:py-20 px-4 border-b border-amber-500/30">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{en ? "Black Deal Month • 25% OFF Everything" : "Black Deal Monat • 25 % Rabatt auf alles"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-5">
            {en ? (
              <>
                <span className="block">Your Personal Song for</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                  €14.99 instead of €19.99
                </span>
              </>
            ) : (
              <>
                <span className="block">Dein persönlicher Song für</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                  14,99 € statt 19,99 €
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed sm:min-h-[5.5rem] mb-8">
            {en
              ? "Save 25% all month long during our Black Deal Month! Tell me your story in 2 minutes – I write the custom lyrics first for your approval, then produce your studio-quality MP3 song within 24 hours."
              : "Unser Black Deal Monat für euch: Sichere dir den ganzen Monat 25 % Rabatt auf dein unvergessliches Geschenk für Weihnachten, Hochzeit oder Geburtstag! Inklusive Songtext-Freigabe vorab per E-Mail."}
          </p>

          {/* Interactive Code + CTA Box */}
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 block">
                  {en ? "Your 25% Promo Code (auto-applied at checkout):" : "Dein 25-%-Aktionscode (im Checkout bereits aktiviert):"}
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <code className="text-xl sm:text-2xl font-black tracking-widest text-white bg-stone-950/80 px-3.5 py-1 rounded-lg border border-amber-400/50">
                    {PROMO_CODE}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (en ? "Copied!" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                  </button>
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>{en ? "25% discount active!" : "25 % Rabatt automatisch aktiv!"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToConfigurator()}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>{en ? "Create your song now for €14.99" : "Jetzt Song für 14,99 € statt 19,99 € gestalten"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-300">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              {en ? "Approve lyrics before production" : "Songtext vorab per E-Mail freigeben"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {en ? "Ready in 24h (weekdays)" : "Meist in 24h fertig (werktags)"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {en ? "1 free revision included" : "1 Änderungsrunde kostenlos"}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Black Deal Month Packages */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mb-3">
            {en ? "3 Black Deal Month Offers – 25% off everything" : "Unsere 3 Black-Deal-Monat Angebote (-25 %)"}
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            {en
              ? "Whether for Christmas, a wedding, a milestone birthday or as a last-minute voucher: code BLACK25 is automatically applied."
              : "Egal ob als Weihnachtsgeschenk, zur Hochzeit, zum runden Geburtstag oder als flexibler Gutschein – der 25-%-Rabatt wird direkt im Checkout abgezogen."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Deal 1: Custom Song */}
          <div className="bg-white rounded-3xl border-2 border-amber-500 p-6 sm:p-7 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider mb-4">
                {en ? "Bestseller • Save €5.00" : "Bestseller • 5,00 € sparen"}
              </span>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                {en ? "Personalized Custom Song" : "Persönlicher Wunschsang"}
              </h3>
              <div className="flex items-baseline gap-2.5 my-4">
                <span className="text-3xl sm:text-4xl font-black text-amber-700">
                  {en ? "€14.99" : "14,99 €"}
                </span>
                <span className="text-base text-stone-400 line-through font-semibold">
                  {en ? "€19.99" : "19,99 €"}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  -25 %
                </span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Custom lyrics with your names & story" : "Maßgeschneiderter Text mit euren Namen & Insidern"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{en ? "Lyrics approval upfront" : "Songtext-Freigabe vorab per E-Mail"}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Full studio quality (MP3) in 24h" : "Volle Studioqualität (MP3) in meist 24h"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "1 free revision round included" : "1 kostenlose Änderungsrunde inklusive"}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => scrollToConfigurator()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4" />
              <span>{en ? "Configure song (€14.99)" : "Song konfigurieren (14,99 €)"}</span>
            </button>
          </div>

          {/* Deal 2: Song + Certificate Bundle */}
          <div className="bg-stone-900 text-white rounded-3xl border border-stone-800 p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider mb-4">
                {en ? "Christmas Gift Tip • Save €7.50" : "Weihnachts-Tipp • 7,50 € sparen"}
              </span>
              <h3 className="text-xl font-black text-white mb-2">
                {en ? "Song + Official QR Certificate" : "Song + Offizielle Song-Urkunde"}
              </h3>
              <div className="flex items-baseline gap-2.5 my-4">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  {en ? "€22.48" : "22,48 €"}
                </span>
                <span className="text-base text-stone-400 line-through font-semibold">
                  {en ? "€29.98" : "29,98 €"}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  -25 %
                </span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{en ? "Everything from the Custom Song package" : "Kompletter persönlicher Wunschsang (MP3)"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{en ? "Printable A4 PDF Song Certificate to frame" : "Druckfertige DIN-A4 Song-Urkunde zum Einrahmen"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{en ? "With QR code: scan & listen on any phone" : "Mit QR-Code: Scannen & Song startet sofort am Handy"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{en ? "Perfect to unwrap under the Christmas tree" : "Perfekt zum Überreichen unterm Weihnachtsbaum"}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => scrollToConfigurator("weihnachten")}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{en ? "Start Christmas Song (€22.48)" : "Weihnachts-Paket starten (22,48 €)"}</span>
            </button>
          </div>

          {/* Deal 3: Gift Voucher */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-lg flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider mb-4">
                {en ? "Flexible Gift • Save €5.00" : "Flexibel verschenken • 5,00 € sparen"}
              </span>
              <h3 className="text-xl font-black text-stone-900 mb-2">
                {en ? "Song Gift Voucher (PDF)" : "Geschenkgutschein für ein Wunschlied"}
              </h3>
              <div className="flex items-baseline gap-2.5 my-4">
                <span className="text-3xl sm:text-4xl font-black text-stone-900">
                  {en ? "€14.99" : "14,99 €"}
                </span>
                <span className="text-base text-stone-400 line-through font-semibold">
                  {en ? "€19.99" : "19,99 €"}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  -25 %
                </span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Recipient chooses style, voice & story later" : "Beschenkte Person wählt Stil & Geschichte selbst"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Delivered as a printable PDF by email" : "Als druckfertiges PDF per E-Mail zum Verschenken"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Valid for 3 years for any occasion" : "3 Jahre gültig für jeden Anlass & jedes Genre"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{en ? "Lock in the 25% Black Deal price today" : "Jetzt 25 % Black-Deal-Vorteil sichern, später einlösen"}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleBuyVoucher}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>{en ? "Buy Voucher for €14.99" : "Gutschein für 14,99 € kaufen"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Audio Samples */}
      <AudioPlayer />

      {/* Embedded Song Configurator */}
      <Configurator initialOccasion="weihnachten" onOpenCheckout={onOpenCheckout} />

      {/* Bottom Trust & Support Strip */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              {en ? "Questions about your Black Deal song order?" : "Fragen zu deiner Bestellung im Black Deal Monat?"}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {en
                ? "Message me directly on WhatsApp or by email – I personally check every single song."
                : "Schreib mir direkt per WhatsApp oder E-Mail – ich beantworte jede Frage persönlich."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20habe%20eine%20Frage%20zum%20Black-Week-Angebot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <PaymentBadges />
          </div>
        </div>
      </section>
    </div>
  );
}

