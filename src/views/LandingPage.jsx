import React, { useState } from "react";
import { 
  Music, Sparkles, Heart, Star, ShieldCheck, Clock, Headphones, 
  ArrowRight, CheckCircle2, ChevronRight, Award, MessageCircle, FileText, Gift 
} from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import Configurator from "../components/Configurator";
import ProductCatalog from "../components/ProductCatalog";
import YouTubeShowcase from "../components/YouTubeShowcase";
import StepProcess from "../components/StepProcess";
import SchemaJsonLd from "../components/SchemaJsonLd";

export default function LandingPage({ onOpenCheckout, onNavigateBlog }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const FAQS = [
    {
      q: "Wie viel kostet ein pers?nlicher Song?",
      a: "Jedes personalisierte Musikst?ck kostet bei uns nur 19,99 ? Festpreis. Es gibt keine versteckten Kosten.",
    },
    {
      q: "Wie lange dauert es, bis mein Song fertig ist?",
      a: "Die Lieferung erfolgt meist innerhalb von 24 Stunden an Werktagen. F?r ganz eilige Anl?sse bieten wir zus?tzlich einen 12-Stunden-Express-Service an.",
    },
    {
      q: "Wie erhalte ich meinen fertigen Song?",
      a: "Wir senden dir deinen fertig gemasterten Song als MP3- und WAV-Audiodatei per E-Mail und auf Wunsch bequem und direkt auf dein Smartphone via WhatsApp!",
    },
    {
      q: "Klingt der Song nach k?nstlicher Computerstimme?",
      a: "Nein! Wir nutzen hochentwickelte KI-Modelle neuester Generation, kombiniert mit professionellem Audio-Mastering und menschlichem Feinschliff. Die Stimmen klingen voll, lebendig, dynamisch und ber?hrend. H?re dir gerne oben unsere echten H?rproben an!",
    },
    {
      q: "Welche Angaben von mir ben?tigt ihr f?r den Songtext?",
      a: "Die Namen der Personen, den Anlass und ein paar pers?nliche Anekdoten, Insider oder Gef?hle, die dir am Herzen liegen. Wir dichten daraus ber?hrende, perfekt gereimte Strophen und einen einpr?gsamen Refrain.",
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SchemaJsonLd type="home" />

      {/* Top Bar / Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 font-black text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
              <Music className="w-5 h-5" />
            </div>
            <span className="tracking-tight">
              MyMusicMoment<span className="text-amber-400">24</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#shop" className="hover:text-amber-400 transition">Shop & Produkte</a>
            <a href="#hoerproben" className="hover:text-amber-400 transition">H?rproben</a>
            <a href="#prozess" className="hover:text-amber-400 transition">Ablauf</a>
            <a href="#konfigurator" className="hover:text-amber-400 transition">Song-Konfigurator</a>
            <a href="#kundenstimmen" className="hover:text-amber-400 transition">Erfahrungen</a>
            <a href="#faq" className="hover:text-amber-400 transition">FAQ</a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="text-amber-400 hover:text-amber-300 transition font-semibold"
            >
              Ratgeber
            </button>
          </nav>

          <a
            href="#shop"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-sm font-black rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            Musik Bestellen (19,99 ?)
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Glowing Background Ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          
          {/* Subheader / Slogan */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> "Von Herzen f?r die Ohren ? MyMusicMoment"
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Ein pers?nlicher Song, der eure Geschichte erz?hlt ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">emotional, individuell & unvergesslich.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Perfekt f?r Hochzeit, Geburtstag oder jeden besonderen Moment. 
            Produktion von <span className="font-semibold text-white">Mensch & KI & Storytelling</span>. 
            Lieferung meist in <span className="font-semibold text-amber-400">24 Stunden (werktags)</span> f?r nur <span className="font-black text-amber-400">19,99 ?</span>.
          </p>

          {/* 3 Emotional Story Cards with Real Photos */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            
            {/* Story Card 1 */}
            <div className="group bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-1.jpg"
                  alt="Suche nach dem perfekten Geschenk"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  1. Inspiration suchen
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-white">Auf der Suche nach dem Einzigartigen</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Du suchst nach einem Geschenk, das wirklich ber?hrt und f?r immer im Herzen bleibt.
                </p>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="group bg-slate-900/90 border border-amber-500/40 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/80 transition duration-300 ring-2 ring-amber-500/20">
              <div className="h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-2.jpg"
                  alt="Begeisterung beim ersten H?ren"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  2. Echte Begeisterung
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-white">G?nsehaut beim ersten H?ren</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Du setzt die Kopfh?rer auf und h?rst eure ganz eigenen Geschichten und Meilensteine als fertigen Song.
                </p>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="group bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-52 overflow-hidden relative bg-slate-950">
                <img
                  src="/images/hero-step-3.jpg"
                  alt="Freudentr?nen und G?nsehaut"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  3. Freudentr?nen
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-white">Ein unvergesslicher Moment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Der gemeinsame Moment auf der Feier: Wenn die ersten Tr?nen der R?hrung flie?en.
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a
              href="#shop"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <span>Jetzt pers?nlichen Song bestellen (19,99 ?)</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#hoerproben"
              className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Headphones className="w-5 h-5 text-amber-400" />
              <span>H?rproben anh?ren</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-900 max-w-xl mx-auto">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-200 ml-1.5 font-bold">Kunden lieben unsere Musik!</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Lieferung in 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>K?uferschutz & Mastering</span>
            </div>
          </div>

        </div>
      </section>

      {/* 1. Product Catalog (19,99 ? Products with Photos) */}
      <ProductCatalog onSelectProduct={handleSelectProduct} />

      {/* 2. YouTube Showcase (@MyMusicMoment24) */}
      <YouTubeShowcase />

      {/* 3. Interactive Audio Player */}
      <AudioPlayer />

      {/* 4. 5-Step Process */}
      <div id="prozess">
        <StepProcess />
      </div>

      {/* 5. Custom Song Configurator */}
      <Configurator onOpenCheckout={onOpenCheckout} />

      {/* 6. Real Customer Testimonials */}
      <section id="kundenstimmen" className="max-w-6xl mx-auto my-20 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
            <Heart className="w-3.5 h-3.5" /> 100% Echte Bewertungen
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Was Kunden sagen
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Echte R?ckmeldungen von Menschen, die mit unseren Liedern besondere Momente geschaffen haben.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Review Tanja aus Stuttgart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed italic mb-6">
                ?Also ich bin jedesmal hellauf begeistert, denn jedes meiner Lieder die ich f?r besondere Menschen ben?tige haben ihre Besonderheiten. 
                Ich bin dem ganzen Team sehr dankbar! Da es eigentlich so eine Besonderheit in sich tr?gt wo jedesmal mit Hingabe gearbeitet wird ins Detail. 
                W?nsche und auch ?nderungen nehmt ihr mit Gelassenheit und Humor auf und gebt einem das Gef?hl das es Ok ist! 
                Ihr seit klasse, und jedesmal mehr als zufriedenstellend.?
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center">
                  TS
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Tanja aus Stuttgart</h4>
                  <p className="text-xs text-amber-400 font-medium">individuelle Geburtstagslieder</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">Verifizierter Kauf</span>
            </div>
          </div>

          {/* Review J?rn aus Neunkirchen */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed italic mb-6">
                ?Ich habe etwas Besonderes f?r einen ganz besonderen Menschen in meinem Leben gesucht ? und hier das perfekte Geschenk gefunden. 
                Wundersch?ne Arbeit, mit viel Liebe gemacht. Vielen Dank! ?????
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center">
                  JN
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">J?rn aus Neunkirchen</h4>
                  <p className="text-xs text-purple-400 font-medium">Hochzeitstag</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">Verifizierter Kauf</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Blog Highlight */}
      <section className="max-w-5xl mx-auto my-16 px-4">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" /> Aus unserem Ratgeber
            </div>
            <h3 className="text-2xl font-bold text-white">
              Individueller Hochzeitssong mit KI: So entsteht euer Song
            </h3>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Erfahre alles ?ber die Vorteile, den Entstehungsprozess und wie du die sch?nsten Anekdoten in den Text einflie?en l?sst.
            </p>
          </div>
          <button
            onClick={() => onNavigateBlog("individueller-hochzeitssong")}
            className="shrink-0 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition flex items-center gap-2"
          >
            Artikel lesen <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto my-20 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">H?ufig gestellte Fragen (FAQ)</h2>
          <p className="text-slate-400 text-sm">Alles, was du ?ber deinen pers?nlichen Song wissen musst</p>
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
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-amber-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Music className="w-5 h-5 text-amber-500" />
            <span>MyMusicMoment24</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a href="#shop" className="hover:text-white transition">Shop (19,99 ?)</a>
            <a href="#hoerproben" className="hover:text-white transition">H?rproben</a>
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

          <p className="text-xs text-slate-500">
            ? 2026 MyMusicMoment24 ? Dirk Schmetzer Online Services
          </p>
        </div>
      </footer>
    </div>
  );
}
