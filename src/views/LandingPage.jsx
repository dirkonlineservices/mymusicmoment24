import React, { useState } from "react";
import { 
  Music, Sparkles, Heart, Star, ShieldCheck, Clock, Headphones, 
  ArrowRight, CheckCircle2, ChevronRight, FileText, Menu, X 
} from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import Configurator from "../components/Configurator";
import ProductCatalog from "../components/ProductCatalog";
import YouTubeShowcase from "../components/YouTubeShowcase";
import StepProcess from "../components/StepProcess";
import SchemaJsonLd from "../components/SchemaJsonLd";

export default function LandingPage({ onOpenCheckout, onNavigateBlog, onNavigateAuthor, onNavigateLegal }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const FAQS = [
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
  ];

  const handleSelectProduct = (product) => {
    const orderData = {
      id: `prod-${product.id}-${Date.now()}`,
      name: product.title,
      price: product.price,
      details: {
        occasion: product.category || "individuell",
        genre: "Wahl nach Wunsch",
        voice: "Passend zum Song",
        language: "Deutsch",
        express: false,
        pdfLyrics: false,
      },
    };
    onOpenCheckout(orderData);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <SchemaJsonLd type="home" />

      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 font-black text-lg sm:text-xl text-white">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="tracking-tight">
              MyMusicMoment<span className="text-amber-400">24</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#shop" className="hover:text-amber-400 transition">Shop & Produkte</a>
            <a href="#hoerproben" className="hover:text-amber-400 transition">Hörproben</a>
            <a href="#prozess" className="hover:text-amber-400 transition">Ablauf</a>
            <a href="#konfigurator" className="hover:text-amber-400 transition">Konfigurator</a>
            <a href="#kundenstimmen" className="hover:text-amber-400 transition">Erfahrungen</a>
            <a href="#faq" className="hover:text-amber-400 transition">FAQ</a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="text-amber-400 hover:text-amber-300 transition font-semibold"
            >
              Ratgeber
            </button>
            <button
              onClick={onNavigateAuthor}
              className="hover:text-amber-400 transition font-medium"
            >
              Über uns
            </button>
          </nav>

          {/* Desktop Action Button & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href="#shop"
              className="hidden sm:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              Musik Bestellen (19,99 €)
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-5 space-y-3 animate-in slide-in-from-top-3">
            <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-200">
              <a href="#shop" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Shop & Produkte (19,99 €)
              </a>
              <a href="#hoerproben" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Hörproben
              </a>
              <a href="#prozess" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Ablauf & WhatsApp
              </a>
              <a href="#konfigurator" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Song-Konfigurator
              </a>
              <a href="#kundenstimmen" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Kundenstimmen & Bewertungen
              </a>
              <a href="#faq" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                Häufig gestellte Fragen (FAQ)
              </a>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateBlog("individueller-hochzeitssong");
                }}
                className="text-left px-3 py-2 rounded-lg text-amber-400 hover:bg-slate-800 transition"
              >
                Ratgeber & Blog
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateAuthor();
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Über Dirk Schmetzer
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateLegal("impressum");
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Impressum
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  onNavigateLegal("datenschutz");
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Datenschutz
              </button>
            </nav>

            <a
              href="#shop"
              onClick={closeMobileMenu}
              className="block text-center w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20"
            >
              Jetzt Musik Bestellen (19,99 €)
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-6 sm:pt-16 sm:pb-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-5 sm:space-y-6">
          
          {/* Subheader Slogan */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>„Von Herzen für die Ohren – MyMusicMoment“</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Ein persönlicher Song, der eure Geschichte erzählt – <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">emotional, individuell & unvergesslich.</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Perfekt für Hochzeit, Geburtstag oder jeden besonderen Moment. 
            Produktion von <span className="font-semibold text-white">Mensch & KI & Storytelling</span>. 
            Lieferung meist in <span className="font-semibold text-amber-400">24 Stunden (werktags)</span> für nur <span className="font-black text-amber-400">19,99 €</span>.
          </p>

          {/* 3 Emotional Story Cards */}
          <div className="pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
            
            {/* Story Card 1 */}
            <div className="group bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-44 sm:h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-1.jpg"
                  alt="Suche nach dem perfekten Geschenk"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-md">
                  1. Inspiration suchen
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-medium rounded-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>KI-Creative</span>
                </span>
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">Auf der Suche nach dem Einzigartigen</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Du suchst nach einem Geschenk, das wirklich berührt und für immer im Herzen bleibt.
                </p>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="group bg-slate-900/90 border border-amber-500/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/80 transition duration-300 ring-2 ring-amber-500/20">
              <div className="h-44 sm:h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-2.jpg"
                  alt="Begeisterung beim ersten Hören"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-md">
                  2. Echte Begeisterung
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-medium rounded-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>KI-Creative</span>
                </span>
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">Gänsehaut beim ersten Hören</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Du setzt die Kopfhörer auf und hörst eure ganz eigenen Geschichten und Meilensteine als fertigen Song.
                </p>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="group bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-44 sm:h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-3.jpg"
                  alt="Freudentränen und Gänsehaut"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-md">
                  3. Freudentränen
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-medium rounded-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>KI-Creative</span>
                </span>
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">Ein unvergesslicher Moment</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Der gemeinsame Moment auf der Feier: Wenn die ersten Tränen der Rührung fließen.
                </p>
              </div>
            </div>

          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            <a
              href="#shop"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <span>Jetzt persönlichen Song bestellen (19,99 €)</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#hoerproben"
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-base rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Hörproben anhören</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 sm:pt-5 flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-xs text-slate-400 border-t border-slate-900 max-w-xl mx-auto">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-200 ml-1 font-bold">Kunden lieben unsere Musik!</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lieferung in 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Käuferschutz & Gratis-Verbesserungsschleife</span>
            </div>
          </div>

        </div>
      </section>

      {/* 1. Product Catalog */}
      <ProductCatalog onSelectProduct={handleSelectProduct} />

      {/* 2. YouTube Showcase */}
      <YouTubeShowcase />

      {/* 3. Audio Player */}
      <AudioPlayer />

      {/* 4. Step Process */}
      <div id="prozess">
        <StepProcess />
      </div>

      {/* 5. Configurator */}
      <Configurator onOpenCheckout={onOpenCheckout} />

      {/* 6. Testimonials */}
      <section id="kundenstimmen" className="max-w-6xl mx-auto my-12 sm:my-20 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
            <Heart className="w-3.5 h-3.5" /> 100% Echte Bewertungen
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Was Kunden sagen
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Echte Rückmeldungen von Menschen, die mit unseren Liedern besondere Momente geschaffen haben.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          
          {/* Review Tanja */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed italic mb-5">
                „Also ich bin jedesmal hellauf begeistert, denn jedes meiner Lieder die ich für besondere Menschen benötige haben ihre Besonderheiten. 
                Ich bin dem ganzen Team sehr dankbar! Da es eigentlich so eine Besonderheit in sich trägt wo jedesmal mit Hingabe gearbeitet wird ins Detail. 
                Wünsche und auch Änderungen nehmt ihr mit Gelassenheit und Humor auf und gebt einem das Gefühl das es Ok ist! 
                Ihr seit klasse, und jedesmal mehr als zufriedenstellend.“
              </p>
            </div>
            <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm">
                  TS
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Tanja aus Stuttgart</h4>
                  <p className="text-[11px] text-amber-400 font-medium">individuelle Geburtstagslieder</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500">Verifizierter Kauf</span>
            </div>
          </div>

          {/* Review Jörn */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed italic mb-5">
                „Ich habe etwas Besonderes für einen ganz besonderen Menschen in meinem Leben gesucht – und hier das perfekte Geschenk gefunden. 
                Wunderschöne Arbeit, mit viel Liebe gemacht. Vielen Dank! 😊👍“
              </p>
            </div>
            <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center text-xs sm:text-sm">
                  JN
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Jörn aus Neunkirchen</h4>
                  <p className="text-[11px] text-purple-400 font-medium">Hochzeitstag</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500">Verifizierter Kauf</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Blog Highlight */}
      <section className="max-w-5xl mx-auto my-12 sm:my-16 px-4">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" /> Aus unserem Ratgeber
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Individueller Hochzeitssong mit KI: So entsteht euer Song
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Erfahre alles über die Vorteile, den Entstehungsprozess und wie du die schönsten Anekdoten in den Text einfließen lässt.
            </p>
          </div>
          <button
            onClick={() => onNavigateBlog("individueller-hochzeitssong")}
            className="w-full sm:w-auto shrink-0 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Artikel lesen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto my-12 sm:my-20 px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Häufig gestellte Fragen (FAQ)</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Alles, was du über deinen persönlichen Song wissen musst</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-200 hover:text-white"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 sm:px-6 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive 4-Column Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-28 sm:pb-16 text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
            {/* Col 1: Brand & E-E-A-T */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-white text-lg">
                <Music className="w-5 h-5 text-amber-500" />
                <span>MyMusicMoment24</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Personalisierte Musikstücke und Songs mit echter Gänsehaut-Garantie. Maßgeschneiderte Texte, moderne KI-Synthese und persönliche Qualitätsprüfung ab 19,99 €.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-400">DS Online Services • Dirk Schmetzer</p>
                <p>Riedgrasweg 30, 70599 Stuttgart (Deutschland)</p>
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

            {/* Col 2: Beliebte Anlässe */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Beliebte Songs
              </h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#shop" className="hover:text-white transition">Hochzeitssong &amp; Traulied</a></li>
                <li><a href="#shop" className="hover:text-white transition">Personalisierter Geburtstagssong</a></li>
                <li><a href="#shop" className="hover:text-white transition">Liebeslied im Duett (2 Stimmen)</a></li>
                <li><a href="#shop" className="hover:text-white transition">Jubiläum &amp; Ruhestand</a></li>
                <li><a href="#shop" className="hover:text-white transition">Partytrack &amp; Stimmungsmusik</a></li>
                <li><a href="#shop" className="hover:text-white transition">Geschenkgutschein (19,99 €)</a></li>
              </ul>
            </div>

            {/* Col 3: Service & Navigation */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Service &amp; Ratgeber
              </h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#prozess" className="hover:text-white transition">5-Schritte-Ablauf &amp; WhatsApp</a></li>
                <li><a href="#hoerproben" className="hover:text-white transition">Hörproben im Audio-Player</a></li>
                <li><a href="#konfigurator" className="hover:text-white transition">Song-Konfigurator starten</a></li>
                <li><a href="#faq" className="hover:text-white transition">Häufige Fragen (FAQ)</a></li>
                <li>
                  <button onClick={() => onNavigateBlog("individueller-hochzeitssong")} className="hover:text-white transition text-left">
                    Ratgeber &amp; KI-Musik Blog
                  </button>
                </li>
                <li>
                  <button onClick={onNavigateAuthor} className="hover:text-white transition text-left">
                    Über Gründer Dirk Schmetzer
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Rechtliches & Datenschutz */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Rechtliches &amp; Datenschutz
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => onNavigateLegal("impressum")} className="hover:text-white font-medium transition text-left flex items-center gap-1.5">
                    <span>⚖️</span>
                    <span>Impressum (§ 5 DDG)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal("datenschutz")} className="hover:text-white font-medium transition text-left flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Datenschutzerklärung (DSGVO)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))} className="hover:text-amber-400 transition text-left underline decoration-dotted flex items-center gap-1.5">
                    <span>🍪</span>
                    <span>Cookie-Einstellungen</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Payment */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
            <p>
              &copy; 2026 MyMusicMoment24 • Dirk Schmetzer Online Services. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold">PayPal</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold text-[#807AFF]">Stripe</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold">Kreditkarte</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold">Apple Pay</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold">Google Pay</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Persönlicher Song</span>
          <span className="text-lg font-black text-amber-400">19,99 €</span>
        </div>
        <a
          href="#shop"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
        >
          <span>Jetzt bestellen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
