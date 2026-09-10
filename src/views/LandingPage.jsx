import React, { useState } from "react";
import { 
  Music, Sparkles, Heart, Star, ShieldCheck, Clock, Headphones, 
  ArrowRight, CheckCircle2, ChevronRight, Award, MessageCircle, FileText 
} from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import Configurator from "../components/Configurator";
import SchemaJsonLd from "../components/SchemaJsonLd";

export default function LandingPage({ onOpenCheckout, onNavigateBlog }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const FAQS = [
    {
      q: "Wie lange dauert es, bis mein Song fertig ist?",
      a: "In der Standard-Produktion ist dein Song in der Regel innerhalb von 24 bis 48 Stunden fertig gemastert. Wenn es besonders eilig ist, kannst du im Konfigurator unseren 12-Stunden-Express-Service buchen.",
    },
    {
      q: "Klingt der Song nach künstlicher Computerstimme?",
      a: "Nein! Wir nutzen hochentwickelte KI-Modelle neuester Generation, kombiniert mit professionellem Audio-Mastering. Die Stimmen klingen voll, menschlich, dynamisch und berührend. Höre dir gerne oben unsere echten Hörproben an!",
    },
    {
      q: "Welche Angaben von mir benötigt ihr für den Songtext?",
      a: "Die Namen der Personen, den Anlass und ein paar persönliche Anekdoten, Insider oder Gefühle, die dir am Herzen liegen. Unser System dichtet daraus berührende, perfekt gereimte Strophen und einen einprägsamen Refrain.",
    },
    {
      q: "Welche Rechte habe ich an dem fertigen Song?",
      a: "Du erhältst die vollen privaten Nutzungsrechte. Du kannst den Song beliebig oft abspielen, auf deiner Hochzeit oder Geburtstagsfeier vorführen, auf USB-Sticks verschenken oder in deinen privaten Videoclips hinterlegen.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SchemaJsonLd type="home" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 font-black text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Music className="w-5 h-5" />
            </div>
            <span className="tracking-tight">
              MyMusicMoment<span className="text-orange-400">24</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#hoerproben" className="hover:text-orange-400 transition">Hörproben</a>
            <a href="#vorteile" className="hover:text-orange-400 transition">So funktioniert's</a>
            <a href="#konfigurator" className="hover:text-orange-400 transition">Song konfigurieren</a>
            <a href="#faq" className="hover:text-orange-400 transition">FAQ</a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="text-orange-400 hover:text-orange-300 transition font-semibold"
            >
              Ratgeber
            </button>
          </nav>

          <a
            href="#konfigurator"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition"
          >
            Song erstellen
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Personalisierte KI-Musik auf Abruf
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Verwandle eure Geschichte in einen <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">einzigartigen Song</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Ob für Hochzeit, runden Geburtstag oder als Liebeserklärung: Ein persönlich komponierter Song berührt zu Tränen und bleibt ein Leben lang in Erinnerung.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#konfigurator"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <span>Jetzt eigenen Song konfigurieren</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#hoerproben"
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Headphones className="w-5 h-5 text-orange-400" />
              <span>Hörproben abspielen</span>
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-900 max-w-xl mx-auto">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-slate-200 ml-1">4.9 / 5.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Fertig in 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Käuferschutz & Mastering</span>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player Section */}
      <AudioPlayer />

      {/* How it Works / Steps */}
      <section id="vorteile" className="max-w-6xl mx-auto my-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            In 3 einfachen Schritten zum Gänsehaut-Moment
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Keine musikalischen Vorkenntnisse erforderlich – wir machen aus deinen Notizen einen professionellen Song.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 border border-orange-500/20">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deine Geschichte teilen</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Wähle den Anlass (z.B. Hochzeit oder Geburtstag) und gib Namen, Kosenamen und persönliche Meilensteine in unseren Konfigurator ein.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 border border-orange-500/20">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2">KI-Komposition & Gesang</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modernste Algorithmen komponieren deine Melodie mit Wunschstimme und Text. Unser Audio-Mastering sorgt für perfekten Studiosound.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 border border-orange-500/20">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lieferung in 24 Stunden</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Du erhältst deinen Song als MP3 und unkomprimierte WAV per Download-Link – bereit für den großen emotionalen Auftritt!
            </p>
          </div>
        </div>
      </section>

      {/* Song Configurator Section */}
      <Configurator onOpenCheckout={onOpenCheckout} />

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto my-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Das sagen Menschen, die ihren Song verschenkt haben
          </h2>
          <p className="text-slate-400 text-sm">Echte Momente voller Freudentränen und Gänsehaut</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-sm text-slate-300 italic mb-4">
              „Beim Eröffnungstanz auf unserer Hochzeit lief unser eigener Song. Es gab niemanden im Saal, der keine Tränen in den Augen hatte. Unbezahlbar!“
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-sm">
                LF
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Laura & Fabian</h4>
                <p className="text-xs text-slate-400">Hochzeitssong (Pop-Ballade)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-sm text-slate-300 italic mb-4">
              „Habe den Song für den 60. Geburtstag meines Vaters erstellen lassen mit all seinen alten Geschichten. Er war sprachlos vor Rührung.“
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-sm">
                MK
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Michael K.</h4>
                <p className="text-xs text-slate-400">Geburtstagslied (Akustik Pop)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-sm text-slate-300 italic mb-4">
              „Express-Bestellung hat in unter 10 Stunden geklappt! Die Qualität des Gesangs und der Text haben meine Erwartungen bei Weitem übertroffen.“
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-sm">
                JS
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Julia S.</h4>
                <p className="text-xs text-slate-400">Jahrestag-Song (R&B)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Highlight Card */}
      <section className="max-w-4xl mx-auto my-16 px-4">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" /> Aus unserem Ratgeber
            </div>
            <h3 className="text-2xl font-bold text-white">
              Individueller Hochzeitssong mit KI: So entsteht euer Song
            </h3>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Erfahre alles über die Vorteile, den Entstehungsprozess und wie du die schönsten Anekdoten in den Text einfließen lässt.
            </p>
          </div>
          <button
            onClick={() => onNavigateBlog("individueller-hochzeitssong")}
            className="shrink-0 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition flex items-center gap-2"
          >
            Artikel lesen <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto my-20 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">Häufig gestellte Fragen (FAQ)</h2>
          <p className="text-slate-400 text-sm">Alles, was du über deinen persönlichen Song wissen musst</p>
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
                  <ChevronRight className={`w-5 h-5 text-orange-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
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
            <Music className="w-5 h-5 text-orange-500" />
            <span>MyMusicMoment24</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a href="#konfigurator" className="hover:text-white transition">Konfigurator</a>
            <a href="#hoerproben" className="hover:text-white transition">Hörproben</a>
            <button
              onClick={() => onNavigateBlog("individueller-hochzeitssong")}
              className="hover:text-white transition"
            >
              Blog & Ratgeber
            </button>
            <a href="/sitemap.xml" className="hover:text-white transition">Sitemap</a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
              className="hover:text-orange-400 transition underline decoration-dotted"
            >
              Cookie-Einstellungen
            </button>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 MyMusicMoment24 • Dirk Schmetzer Online Services
          </p>
        </div>
      </footer>
    </div>
  );
}
