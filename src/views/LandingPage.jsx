import React, { useState } from "react";
import { 
  Music, Sparkles, Heart, Star, ShieldCheck, Clock, Headphones, Gift, Play, Check,
  ArrowRight, ChevronRight, FileText, Menu, X, ExternalLink, CreditCard, PartyPopper, Cake
} from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import Configurator from "../components/Configurator";
import YouTubeShowcase from "../components/YouTubeShowcase";
import SchemaJsonLd from "../components/SchemaJsonLd";
import PaymentBadges from "../components/PaymentBadges";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

const HERO_VIDEO_ID = "MCL9AYpNQa0";

const OCCASION_TILES = [
  { id: "hochzeit", image: "/images/hochzeit.jpg", icon: Heart },
  { id: "geburtstag", image: "/images/geburtstag.jpg", icon: Cake },
  { id: "liebe", image: "/images/duett.jpg", icon: Sparkles },
  { id: "party", image: "/images/party.jpg", icon: PartyPopper },
];

// Ratgeber-Seiten pro Anlass (Fußzeile)
const OCCASION_GUIDES = [
  { slug: "personalisierter-song-weihnachtsgeschenk", label: "Song als Weihnachtsgeschenk" },
  { slug: "individueller-hochzeitssong", label: "Hochzeitslied" },
  { slug: "personalisierte-geburtstagslieder", label: "Geburtstagslied mit Namen" },
  { slug: "song-zum-18-geburtstag", label: "Song zum 18. Geburtstag" },
  { slug: "song-zum-50-geburtstag", label: "Song zum 50. Geburtstag" },
  { slug: "lied-fuer-mama", label: "Lied für Mama" },
  { slug: "jubilaum-song", label: "Jubiläum & Hochzeitstag" },
  { slug: "personalisierte-lieder", label: "Personalisierten Song erstellen lassen" },
];

// Letzter Bestelltag für Weihnachten; Banner erscheint von Oktober bis zu diesem Tag
function getXmasDaysLeft(now = new Date()) {
  const deadline = new Date(now.getFullYear(), 11, 23, 23, 59, 59);
  if (now.getMonth() < 9 || now > deadline) return null;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDeadline = new Date(now.getFullYear(), 11, 23);
  return Math.round((startOfDeadline - startOfToday) / 86400000);
}

// Sterne-Zeile mit der echten Google-Bewertung aus dem Unternehmensprofil
const GOOGLE_PROFILE_URL = "https://g.page/r/CSSesokOK__iEBM";

function GoogleRating({ className = "" }) {
  const { t } = useLanguage();
  return (
    <div className={`flex ${className}`}>
      <a
        href={GOOGLE_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm hover:underline underline-offset-2"
      >
        <span className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </span>
        <span className="font-bold text-stone-900">{t("testimonials.googleRating")}</span>
        <span className="text-stone-500">· {t("testimonials.googleCount")}</span>
      </a>
    </div>
  );
}

function scrollToConfigurator() {
  const el = document.getElementById("konfigurator");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
export default function LandingPage({ onOpenCheckout, onNavigateBlog, onNavigateAuthor, onNavigateLegal, onNavigateSupport, onNavigateB2B }) {
  const { t, language } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = t("faq.items", [
    {
      q: "Wie viel kostet ein persönlicher Song?",
      a: "Jedes personalisierte Musikstück kostet bei uns nur 19,99 € Festpreis. Es gibt keine versteckten Kosten.",
    },
    {
      q: "Wie lange dauert es, bis mein Song fertig ist?",
      a: "Die Lieferung erfolgt meist innerhalb von 24 Stunden an Werktagen. Für ganz eilige Anlässe bieten wir zusätzlich einen 12-Stunden-Express-Service an.",
    },
    {
      q: "Wie erhalte ich meinen fertigen Song?",
      a: "Wir senden dir deinen fertig erstellten und persönlich geprüften Song als hochwertige MP3-Audiodatei per E-Mail und auf Wunsch bequem und direkt auf dein Smartphone via WhatsApp!",
    },
    {
      q: "Klingt der Song nach künstlicher Computerstimme?",
      a: "Nein! Wir nutzen hochentwickelte KI-Modelle neuester Generation, kombiniert mit menschlichem Feinschliff und persönlicher Qualitätskontrolle. Wir hören uns jeden Song vor der Übergabe an und stellen sicher, dass Melodie, Gesang und Rhythmus harmonieren.",
    },
    {
      q: "Was passiert, wenn ich nach Erhalt noch einen Änderungswunsch habe?",
      a: "Kein Problem! Wir hören uns jeden Song vorab sorgfältig an. Solltest du dennoch eine Text- oder Detailanpassung wünschen, ist 1 kostenfreie Verbesserungsschleife bei jeder Bestellung garantiert inklusive.",
    },
    {
      q: "Welche Angaben von mir benötigt ihr für den Songtext?",
      a: "Die Namen der Personen, den Anlass und ein paar persönliche Anekdoten, Insider oder Gefühle, die dir am Herzen liegen. Wir dichten daraus berührende, perfekt gereimte Strophen und einen einprägsamen Refrain.",
    },
    {
      q: "Kann mein Song auch auf Spotify, Apple Music & YouTube Music veröffentlicht werden?",
      a: "Ja, absolut! Wenn du möchtest, dass dein Lied weltweit gestreamt und in Playlists geteilt werden kann, übernehmen wir gerne die Veröffentlichung über unseren Musikvertrieb (DistroKid) für dich. Dein Song erscheint dann unter unserem offiziellen Künstlerprofil „MyMusicMoment24“ auf Spotify, Apple Music, YouTube Music, Amazon Music und Co. Dieser Service kostet einmalig nur 4,99 € (dauerhaft online, kein Abo). Du erhältst den Link dazu direkt in deiner Fertigstellungs-E-Mail oder kannst uns jederzeit ansprechen.",
    },
    {
      q: "Kann ich auch per Banküberweisung oder ohne PayPal-Konto zahlen?",
      a: "Ja, selbstverständlich! Bei PayPal kannst du auch ohne eigenes PayPal-Konto ganz einfach per SEPA-Lastschrift oder Debitkarte als Gast bezahlen. Alternativ kannst du auch per normaler Banküberweisung (Vorkasse) zahlen – kontaktiere uns dazu einfach kurz per WhatsApp oder E-Mail für unsere IBAN. Wichtig: Bei Überweisung beginnt die Produktion deines Songs sofort nach Geldeingang auf unserem Bankkonto (in der Regel 1 Werktag).",
    },
    {
      q: "Warum ist der Bezahl-Button anfangs inaktiv / ausgegraut?",
      a: "Aus rechtlichen Gründen (Verzicht auf das 14-tägige Widerrufsrecht bei individueller digitaler Maßanfertigung deines Liedes) wird der Bezahl-Button erst aktiv, sobald du deine E-Mail-Adresse für die Songzustellung eingegeben und das Zustimmungs-Kästchen für unsere AGB und den sofortigen Produktionsstart angehakt hast.",
    },
  ]);

  const steps = t("home.steps", []);
  const priceIncluded = t("home.priceIncluded", []);
  const priceExtras = t("home.priceExtras", []);
  const googleReviews = t("testimonials.googleItems", []);
  const [heroVideoOpen, setHeroVideoOpen] = useState(false);
  const xmasDaysLeft = getXmasDaysLeft();

  const handleBuyVoucher = () => {
    onOpenCheckout({
      id: `prod-gutschein-${Date.now()}`,
      name: t("home.voucherProductName"),
      price: 19.99,
      category: "gutschein",
      details: {
        occasion: "gutschein",
        genre: "Wahl beim Einlösen",
        voice: "Wahl beim Einlösen",
        language: "Deutsch",
        express: false,
        pdfLyrics: false,
      },
    });
  };

  const handleSelectOccasion = (occasion) => {
    scrollToConfigurator();
    window.dispatchEvent(new CustomEvent("preselect-occasion", { detail: { occasion } }));
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      <SchemaJsonLd type="home" />

      {/* Weihnachts-Banner */}
      {xmasDaysLeft !== null && (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-center">
            <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] bg-white/15 px-2 py-0.5 rounded">
              <Gift className="w-3.5 h-3.5" /> {t("home.xmasBadge")}
            </span>
            <span className="font-medium">{t("home.xmasText")}</span>
            <span className="font-black text-amber-200">
              {xmasDaysLeft === 0 ? t("home.xmasLastDay") : t("home.xmasDaysLeft").replace("{n}", xmasDaysLeft)}
            </span>
            <a href="/personalisierter-song-weihnachtsgeschenk" className="underline underline-offset-2 font-bold hover:text-amber-200">
              {t("home.xmasCta")}
            </a>
          </div>
        </div>
      )}
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="MyMusicMoment24 Startseite">
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              width="40"
              height="40"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight text-stone-900 leading-tight">
                MyMusicMoment<span className="text-amber-500">24</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 leading-none tracking-normal">
                {t("nav.tagline")}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600 whitespace-nowrap">
            <a href="#shop" className="hover:text-amber-600 transition">{t("nav.shop")}</a>
            <a href="#hoerproben" className="hover:text-amber-600 transition">{t("nav.samples")}</a>
            <a href="#prozess" className="hover:text-amber-600 transition">{t("nav.process")}</a>
            <a href="#preise" className="hover:text-amber-600 transition">{t("nav.prices", "Preise")}</a>
            <a href="#kundenstimmen" className="hover:text-amber-600 transition">{t("nav.reviews")}</a>
            <a href="#faq" className="hover:text-amber-600 transition">{t("nav.faq")}</a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="text-amber-600 hover:text-amber-700 transition font-semibold"
            >
              {t("nav.guide")}
            </button>
            <button
              onClick={onNavigateAuthor}
              className="hover:text-amber-600 transition font-medium"
            >
              {t("nav.about")}
            </button>
          </nav>

          {/* Desktop Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#konfigurator"
              className="hidden sm:inline-flex whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              {t("nav.orderCta")}
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-stone-200 px-4 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-3">
            <div className="flex items-center justify-between px-3 pb-2 border-b border-stone-200">
              <span className="text-xs text-stone-500 font-medium">Sprache / Language:</span>
              <LanguageSwitcher />
            </div>
            <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-stone-700">
              <a href="#shop" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.shop")}
              </a>
              <a href="#hoerproben" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.samples")}
              </a>
              <a href="#prozess" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.process")} &amp; WhatsApp
              </a>
              <a href="#konfigurator" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.configurator")}
              </a>
              <a href="#kundenstimmen" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.reviews")}
              </a>
              <a href="#faq" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-stone-50 transition">
                {t("nav.faq")}
              </a>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateBlog("individueller-hochzeitssong");
                }}
                className="text-left px-3 py-2 rounded-lg text-amber-600 hover:bg-stone-50 transition font-semibold"
              >
                {t("nav.guide")} &amp; Blog
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateAuthor();
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-50 transition"
              >
                {t("footer.aboutLink")}
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateB2B();
                }}
                className="text-left px-3 py-2 rounded-lg text-amber-700 hover:bg-stone-50 transition font-semibold"
              >
                💼 Für Agenturen &amp; B2B
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateLegal("impressum");
                }}
                className="text-left px-3 py-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition"
              >
                {t("nav.impressum")}
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateLegal("datenschutz");
                }}
                className="text-left px-3 py-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition"
              >
                {t("nav.privacy")}
              </button>
            </nav>

            <a
              href="#konfigurator"
              onClick={closeMobileMenu}
              className="block text-center w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20"
            >
              {t("nav.mobileOrderCta")}
            </a>
          </div>
        )}
      </header>


      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-gradient-to-bl from-amber-300/25 via-orange-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 sm:pt-14 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{t("home.heroEyebrow")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              {t("home.heroTitle")}{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500">
                {t("home.heroTitleHighlight")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("home.heroText")}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="#konfigurator"
                className="w-full sm:w-auto whitespace-nowrap px-7 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
              >
                <span>{t("home.heroCta")}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#hoerproben"
                className="w-full sm:w-auto whitespace-nowrap px-6 py-4 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm sm:text-base rounded-2xl border border-stone-300 shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Headphones className="w-5 h-5 text-amber-600" />
                <span>{t("home.heroCtaSecondary")}</span>
              </a>
            </div>

            <GoogleRating className="justify-center lg:justify-start" />

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-md mx-auto lg:mx-0 text-sm text-stone-700 text-left">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" />{t("home.trustPrice")}</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600 shrink-0" />{t("home.trustDelivery")}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />{t("home.trustRevision")}</li>
              <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-amber-600 shrink-0" />{t("home.trustPayment")}</li>
            </ul>
          </div>

          {/* Hörprobe im Hero: erst Bild, Video lädt erst nach Klick */}
          <div className="relative max-w-xl w-full mx-auto">
            <div className="absolute -inset-3 bg-gradient-to-tr from-amber-400/30 to-orange-300/20 rounded-[2rem] blur-xl pointer-events-none" />
            <div className="relative bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/50">
              <div className="aspect-[4/3] relative bg-stone-900">
                {heroVideoOpen ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?autoplay=1&rel=0`}
                    title={t("home.heroVideoLabel")}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setHeroVideoOpen(true)}
                    className="group absolute inset-0 w-full h-full"
                    aria-label={t("home.heroVideoHint")}
                  >
                    <img
                      src="/images/hochzeit.jpg"
                      alt={t("home.heroVideoLabel")}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width="800"
                      height="600"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-20 h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:scale-110 transition">
                        <Play className="w-8 h-8 text-amber-600 fill-amber-500 ml-1" />
                      </span>
                    </span>
                    <span className="absolute bottom-4 left-4 right-4 text-left text-white">
                      <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">{t("home.heroVideoHint")}</span>
                      <span className="block text-base sm:text-lg font-bold">{t("home.heroVideoLabel")}</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
            <p className="relative text-[11px] text-stone-400 text-center mt-2">{t("home.heroVideoPrivacy")}</p>
          </div>
        </div>
      </section>

      {/* Anlässe: Einstieg direkt in den Konfigurator */}
      <section id="shop" className="max-w-7xl mx-auto px-4 my-10 sm:my-16 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">{t("home.occasionsTitle")}</h2>
          <p className="text-stone-600 text-sm sm:text-base">{t("home.occasionsSubtitle")}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {OCCASION_TILES.map(({ id, image, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelectOccasion(id)}
              className="group text-left bg-white border border-stone-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-stone-200/50 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="aspect-square overflow-hidden bg-stone-100 relative">
                <img
                  src={image}
                  alt={t(`home.occasions.${id}.label`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                />
                <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 shadow flex items-center justify-center">
                  <Icon className="w-4 h-4 text-amber-600" />
                </span>
              </div>
              <div className="p-3.5 sm:p-5">
                <h3 className="font-bold text-sm sm:text-lg text-stone-900">{t(`home.occasions.${id}.label`)}</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-snug">{t(`home.occasions.${id}.desc`)}</p>
                <span className="mt-2.5 inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-700 group-hover:gap-2 transition-all">
                  {t("home.occasionsCta")} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Hörproben */}
      <YouTubeShowcase />
      <AudioPlayer />

      {/* Ablauf in 3 Schritten */}
      <section id="prozess" className="max-w-6xl mx-auto px-4 my-12 sm:my-20 scroll-mt-20">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight text-center mb-8 sm:mb-10">{t("home.stepsTitle")}</h2>
        <ol className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step, idx) => (
            <li key={idx} className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 shadow-lg shadow-stone-200/50">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center mb-4 shadow-md">
                {idx + 1}
              </span>
              <h3 className="font-bold text-lg text-stone-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>
      {/* Kundenstimmen */}
      <section id="kundenstimmen" className="max-w-6xl mx-auto my-12 sm:my-20 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
            <Heart className="w-3.5 h-3.5 text-amber-600" /> {t("testimonials.badge")}
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t("testimonials.title")}
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto text-xs sm:text-sm">
            {t("testimonials.subtitle")}
          </p>
          <GoogleRating className="justify-center mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Review Tanja */}
          <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-stone-200/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed italic mb-5">
                {t("testimonials.tanjaText")}
              </p>
            </div>
            <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-sm">
                  TS
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{t("testimonials.tanjaLocation")}</h4>
                  <p className="text-[11px] text-amber-600 font-semibold">{t("testimonials.tanjaTitle")}</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-stone-400">{t("testimonials.verifiedBuyer")}</span>
            </div>
          </div>

          {/* Review Jörn */}
          <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-stone-200/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed italic mb-5">
                {t("testimonials.joernText")}
              </p>
            </div>
            <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center text-xs sm:text-sm shadow-sm">
                  JN
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{t("testimonials.joernLocation")}</h4>
                  <p className="text-[11px] text-purple-600 font-semibold">{t("testimonials.joernTitle")}</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-stone-400">{t("testimonials.verifiedBuyer")}</span>
            </div>
          </div>

          {/* Google-Rezensionen (nur sichtbar, bewusst ohne Schema-Auszeichnung) */}
          {googleReviews.map((review) => (
            <div key={review.name} className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-stone-200/50 hover:shadow-xl transition">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed italic mb-5">{review.text}</p>
              </div>
              <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black flex items-center justify-center text-xs sm:text-sm shadow-sm">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{review.name}</h4>
                    <p className="text-[11px] text-blue-600 font-semibold">{review.title}</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs text-stone-400">{t("testimonials.googleSource")}</span>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Preis & Leistungen */}
      <section id="preise" className="max-w-5xl mx-auto px-4 my-12 sm:my-20 scroll-mt-20">
        <div className="bg-white border-2 border-amber-300 rounded-3xl shadow-2xl shadow-amber-900/10 overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-3 p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{t("home.priceTitle")}</h2>
            <p className="text-stone-600 text-sm mt-1 mb-6">{t("home.priceSubtitle")}</p>
            <ul className="space-y-3">
              {priceIncluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-stone-800">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 bg-gradient-to-b from-amber-50 to-orange-50/60 border-t md:border-t-0 md:border-l border-amber-200 p-6 sm:p-10 flex flex-col">
            <div className="text-5xl font-black text-stone-900 tracking-tight">19,99 €</div>
            <p className="text-xs text-stone-500 mt-1 mb-6">{t("home.trustPayment")}</p>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">{t("home.priceExtrasTitle")}</h3>
            <ul className="space-y-2 text-sm text-stone-700 mb-6">
              {priceExtras.map((extra, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span>{extra.label}</span>
                  <span className="font-semibold text-stone-900 whitespace-nowrap">{extra.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{t("home.priceGuarantee")}</span>
            </div>
            <a
              href="#konfigurator"
              className="mt-auto w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>{t("home.priceCta")}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Geschenkgutschein */}
      <section id="gutschein" className="max-w-5xl mx-auto px-4 my-12 sm:my-16 scroll-mt-20">
        <div className="bg-gradient-to-br from-red-50 via-white to-amber-50 border border-red-200 rounded-3xl shadow-xl shadow-red-900/5 overflow-hidden grid md:grid-cols-5 items-center">
          <div className="md:col-span-3 p-6 sm:p-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
              <Gift className="w-3.5 h-3.5" /> {t("catalog.voucherBanner.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{t("catalog.voucherBanner.title")}</h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{t("catalog.voucherBanner.desc")}</p>
            <ul className="space-y-2 text-sm text-stone-800">
              {["feature1", "feature2", "feature3"].map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                  {t(`catalog.voucherBanner.${key}`)}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleBuyVoucher}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Gift className="w-5 h-5" />
              <span>{t("catalog.voucherBanner.btn")}</span>
            </button>
          </div>
          <div className="md:col-span-2 p-6 sm:p-8">
            <img
              src="/images/gutschein.jpg"
              alt={t("catalog.voucherBanner.title")}
              className="w-full rounded-2xl shadow-2xl rotate-1"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Konfigurator */}
      <Configurator onOpenCheckout={onOpenCheckout} />
      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto my-12 sm:my-20 px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">{t("faq.title")}</h2>
          <p className="text-stone-600 text-xs sm:text-sm">{t("faq.subtitle")}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200 hover:border-amber-400 rounded-2xl overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between font-bold text-xs sm:text-sm text-stone-900 hover:text-amber-700"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 sm:px-6 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ratgeber-Hinweis */}
      <section className="max-w-5xl mx-auto my-12 sm:my-16 px-4">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border-2 border-amber-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-amber-900/5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-amber-600" /> {t("blogFeature.badge")}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              {t("blogFeature.title")}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
              {t("blogFeature.subtitle")}
            </p>
          </div>
          <button
            onClick={() => onNavigateBlog("individueller-hochzeitssong")}
            className="w-full sm:w-auto shrink-0 px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>{t("blogFeature.readArticle")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="max-w-5xl mx-auto px-4 my-12 sm:my-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white p-8 sm:p-14 text-center shadow-2xl">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <Music className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">{t("home.finalTitle")}</h2>
          <p className="text-stone-300 text-sm sm:text-lg max-w-xl mx-auto mb-7">{t("home.finalText")}</p>
          <a
            href="#konfigurator"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/30 items-center gap-2 transition active:scale-95"
          >
            <span>{t("home.finalCta")}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
      {/* Comprehensive 4-Column Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-28 sm:pb-16 text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
            {/* Col 1: Brand & E-E-A-T */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo-icon.png"
                  alt="MyMusicMoment24 Logo"
                  width="32"
                  height="32"
                  loading="lazy"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <span className="font-bold text-white text-lg leading-tight block">
                    MyMusicMoment<span className="text-amber-400">24</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal leading-none block mt-0.5">
                    {t("nav.tagline")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("footer.brandDesc")}
              </p>
              <div className="pt-1">
                <a
                  href="https://www.sichtbarmitki.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 transition-colors text-xs"
                >
                  <span>Digitalagentur: sichtbarmitKI.agency</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="pt-1">
                <a
                  href="https://www.youtube.com/@MyMusicMoment24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-600/20 transition"
                >
                  <span>YouTube: @MyMusicMoment24</span>
                </a>
              </div>
            </div>

            {/* Col 2: Beliebte Anlässe (echte Links für Google) */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                {t("footer.popularSongs")}
              </h3>
              <ul className="space-y-2 text-xs">
                {OCCASION_GUIDES.map((guide) => (
                  <li key={guide.slug}>
                    <a href={`/${guide.slug}`} className="hover:text-white transition">{guide.label}</a>
                  </li>
                ))}
                <li><a href="#gutschein" className="hover:text-white transition">{t("footer.giftVoucher")}</a></li>
              </ul>
            </div>

            {/* Col 3: Service & Navigation */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                {t("footer.serviceGuide")}
              </h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#prozess" className="hover:text-white transition">{t("footer.processSteps")}</a></li>
                <li><a href="#hoerproben" className="hover:text-white transition">{t("footer.audioSamples")}</a></li>
                <li><a href="#konfigurator" className="hover:text-white transition">{t("footer.startConfigurator")}</a></li>
                <li><a href="#faq" className="hover:text-white transition">{t("footer.faq")}</a></li>
                <li>
                  <button onClick={onNavigateAuthor} className="hover:text-white transition text-left">
                    {t("footer.aboutLink")}
                  </button>
                </li>
                <li>
                  <button onClick={onNavigateB2B} className="hover:text-amber-400 transition text-left flex items-center gap-1.5 font-medium text-amber-400/90">
                    <span>💼</span>
                    <span>{t("footer.b2bLink", "Für Agenturen & B2B")}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Rechtliches & Datenschutz */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                {t("footer.legalHeader")}
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => onNavigateLegal("impressum")} className="hover:text-white font-medium transition text-left flex items-center gap-1.5">
                    <span>⚖️</span>
                    <span>{t("footer.impressum")}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal("datenschutz")} className="hover:text-white font-medium transition text-left flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>{t("footer.privacy")}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))} className="hover:text-amber-400 transition text-left underline decoration-dotted flex items-center gap-1.5">
                    <span>🍪</span>
                    <span>{t("footer.cookieSettings")}</span>
                  </button>
                </li>
                <li className="pt-1.5">
                  <button onClick={onNavigateSupport} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold transition text-left flex items-center gap-1.5 text-xs">
                    <span>💬</span>
                    <span>{t("footer.supportLink", "WhatsApp-Support & Hilfe")}</span>
                  </button>
                </li>
                <li className="pt-1">
                  <button onClick={onNavigateB2B} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 font-bold transition text-left flex items-center gap-1.5 text-xs">
                    <span>🤝</span>
                    <span>{t("footer.b2bButton", "B2B & Kooperationsanfrage")}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Payment */}
          <div className="pt-8 border-t border-slate-900/80 flex flex-col lg:flex-row items-center justify-between gap-5 text-[11px] text-slate-500 text-center lg:text-left">
            <div className="space-y-1">
              <p>
                {t("footer.allRights")}
              </p>
              <p className="text-[10px] text-slate-600">
                {t("footer.sslSecurity")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hidden sm:inline mr-1">
                {t("footer.paymentMethods")}
              </span>
              <PaymentBadges />
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">{t("footer.stickyTitle")}</span>
          <span className="text-lg font-black text-amber-600">19,99 €</span>
        </div>
        <a
          href="#konfigurator"
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
        >
          <span>{t("footer.stickyCta")}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
