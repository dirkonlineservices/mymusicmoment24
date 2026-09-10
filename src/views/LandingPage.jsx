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

export default function LandingPage({ onOpenCheckout, onNavigateBlog }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const FAQS = [
    {
      q: "Wie viel kostet ein pers\u00f6nlicher Song?",
      a: "Jedes personalisierte Musikst\u00fcck kostet bei uns nur 19,99 \u20ac Festpreis. Es gibt keine versteckten Kosten.",
    },
    {
      q: "Wie lange dauert es, bis mein Song fertig ist?",
      a: "Die Lieferung erfolgt meist innerhalb von 24 Stunden an Werktagen. F\u00fcr ganz eilige Anl\u00e4sse bieten wir zus\u00e4tzlich einen 12-Stunden-Express-Service an.",
    },
    {
      q: "Wie erhalte ich meinen fertigen Song?",
      a: "Wir senden dir deinen fertig gemasterten Song als MP3- und WAV-Audiodatei per E-Mail und auf Wunsch bequem und direkt auf dein Smartphone via WhatsApp!",
    },
    {
      q: "Klingt der Song nach k\u00fcnstlicher Computerstimme?",
      a: "Nein! Wir nutzen hochentwickelte KI-Modelle neuester Generation, kombiniert mit professionellem Audio-Mastering und menschlichem Feinschliff. Die Stimmen klingen voll, lebendig, dynamisch und ber\u00fchrend. H\u00f6re dir gerne oben unsere echten H\u00f6rproben an!",
    },
    {
      q: "Welche Angaben von mir ben\u00f6tigt ihr f\u00fcr den Songtext?",
      a: "Die Namen der Personen, den Anlass und ein paar pers\u00f6nliche Anekdoten, Insider oder Gef\u00fchle, die dir am Herzen liegen. Wir dichten daraus ber\u00fchrende, perfekt gereimte Strophen und einen einpr\u00e4gsamen Refrain.",
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
            <a href="#hoerproben" className="hover:text-amber-400 transition">H\u00f6rproben</a>
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
          </nav>

          {/* Desktop Action Button & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href="#shop"
              className="hidden sm:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              Musik Bestellen (19,99 \u20ac)
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Men\u00fc \u00f6ffnen"
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
                Shop & Produkte (19,99 \u20ac)
              </a>
              <a href="#hoerproben" onClick={closeMobileMenu} className="px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                H\u00f6rproben
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
                H\u00e4ufig gestellte Fragen (FAQ)
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
            </nav>

            <a
              href="#shop"
              onClick={closeMobileMenu}
              className="block text-center w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20"
            >
              Jetzt Musik Bestellen (19,99 \u20ac)
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-14 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-5 sm:space-y-6">
          
          {/* Subheader Slogan */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>\u201eVon Herzen f\u00fcr die Ohren \u2013 MyMusicMoment\u201c</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Ein pers\u00f6nlicher Song, der eure Geschichte erz\u00e4hlt \u2013 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">emotional, individuell & unvergesslich.</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Perfekt f\u00fcr Hochzeit, Geburtstag oder jeden besonderen Moment. 
            Produktion von <span className="font-semibold text-white">Mensch & KI & Storytelling</span>. 
            Lieferung meist in <span className="font-semibold text-amber-400">24 Stunden (werktags)</span> f\u00fcr nur <span className="font-black text-amber-400">19,99 \u20ac</span>.
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
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">Auf der Suche nach dem Einzigartigen</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Du suchst nach einem Geschenk, das wirklich ber\u00fchrt und f\u00fcr immer im Herzen bleibt.
                </p>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="group bg-slate-900/90 border border-amber-500/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/80 transition duration-300 ring-2 ring-amber-500/20">
              <div className="h-44 sm:h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-2.jpg"
                  alt="Begeisterung beim ersten H\u00f6ren"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-md">
                  2. Echte Begeisterung
                </span>
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">G\u00e4nsehaut beim ersten H\u00f6ren</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Du setzt die Kopfh\u00f6rer auf und h\u00f6rst eure ganz eigenen Geschichten und Meilensteine als fertigen Song.
                </p>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="group bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-44 sm:h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-3.jpg"
                  alt="Freudentr\u00e4nen und G\u00e4nsehaut"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-md">
                  3. Freudentr\u00e4nen
                </span>
              </div>
              <div className="p-3.5 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-white">Ein unvergesslicher Moment</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Der gemeinsame Moment auf der Feier: Wenn die ersten Tr\u00e4nen der R\u00fchrung flie\u00dfen.
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
              <span>Jetzt pers\u00f6nlichen Song bestellen (19,99 \u20ac)</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#hoerproben"
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-base rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>H\u00f6rproben anh\u00f6ren</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 border-t border-slate-900 max-w-xl mx-auto">
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
              <span>K\u00e4uferschutz & Studio-Mastering</span>
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
            Echte R\u00fcckmeldungen von Menschen, die mit unseren Liedern besondere Momente geschaffen haben.
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
                \u201eAlso ich bin jedesmal hellauf begeistert, denn jedes meiner Lieder die ich f\u00fcr besondere Menschen ben\u00f6tige haben ihre Besonderheiten. 
                Ich bin dem ganzen Team sehr dankbar! Da es eigentlich so eine Besonderheit in sich tr\u00e4gt wo jedesmal mit Hingabe gearbeitet wird ins Detail. 
                W\u00fcnsche und auch \u00c4nderungen nehmt ihr mit Gelassenheit und Humor auf und gebt einem das Gef\u00fchl das es Ok ist! 
                Ihr seit klasse, und jedesmal mehr als zufriedenstellend.\u201c
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

          {/* Review J\u00f6rn */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed italic mb-5">
                \u201eIch habe etwas Besonderes f\u00fcr einen ganz besonderen Menschen in meinem Leben gesucht \u2013 und hier das perfekte Geschenk gefunden. 
                Wundersch\u00f6ne Arbeit, mit viel Liebe gemacht. Vielen Dank! \ud83d\ude0a\ud83d\udc4d\u201c
              </p>
            </div>
            <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center text-xs sm:text-sm">
                  JN
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">J\u00f6rn aus Neunkirchen</h4>
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
              Erfahre alles \u00fcber die Vorteile, den Entstehungsprozess und wie du die sch\u00f6nsten Anekdoten in den Text einflie\u00dfen l\u00e4sst.
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">H\u00e4ufig gestellte Fragen (FAQ)</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Alles, was du \u00fcber deinen pers\u00f6nlichen Song wissen musst</p>
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

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 sm:py-12 text-xs sm:text-sm text-slate-400 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Music className="w-5 h-5 text-amber-500" />
            <span>MyMusicMoment24</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
            <a href="#shop" className="hover:text-white transition">Shop (19,99 \u20ac)</a>
            <a href="#hoerproben" className="hover:text-white transition">H\u00f6rproben</a>
            <a href="https://www.youtube.com/@MyMusicMoment24" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition">
              YouTube Kanal
            </a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="hover:text-white transition"
            >
              Blog & Ratgeber
            </button>
            <a href="/sitemap.xml" className="hover:text-white transition">Sitemap</a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
              className="hover:text-amber-400 transition underline decoration-dotted"
            >
              Cookie-Einstellungen
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            \u00a9 2026 MyMusicMoment24 \u2022 Dirk Schmetzer Online Services
          </p>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Pers\u00f6nlicher Song</span>
          <span className="text-lg font-black text-amber-400">19,99 \u20ac</span>
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
