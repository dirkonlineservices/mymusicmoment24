import React from "react";

import { ArrowLeft, CheckCircle2, Music, Sparkles, Youtube, Heart, Award, ShieldCheck, Mail, MessageSquare } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AuthorPage({ onBackToHome, onGoToConfigurator }) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-bold text-white hover:opacity-90 transition"
          >
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              className="w-7 h-7 object-contain"
            />
            <span>MyMusicMoment<span className="text-amber-400">24</span></span>
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Über den Gründer & Musikproduzenten
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Dirk Schmetzer
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Gründer von MyMusicMoment24 – Emotionale Songwriting-Kreativität trifft auf modernste KI-Klangsynthese.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center h-fit shadow-2xl">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <img
                src="/images/dirk-schmetzer.png"
                alt="Dirk Schmetzer – Gründer & Musikproduzent bei MyMusicMoment24"
                className="relative w-32 h-32 rounded-full object-cover border-2 border-amber-400 shadow-xl shadow-orange-500/20"
              />
            </div>
            <h2 className="text-xl font-bold text-white">Dirk Schmetzer</h2>
            <p className="text-sm text-amber-400 font-medium mb-4">Gründer &amp; Prompt-Engineer</p>
            
            <div className="flex flex-col gap-2.5 text-left text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DS Online Services (Stuttgart)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Über hunderte begeisterte Kundenlieder</span>
              </div>
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                <span>YouTube: @MyMusicMoment24</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href="https://www.youtube.com/@MyMusicMoment24"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition shadow-lg shadow-red-600/20"
              >
                <Youtube className="w-4 h-4" /> Zum YouTube-Kanal
              </a>
            </div>
          </div>

          {/* Bio Story */}
          <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Meine Mission: Musik, die mitten ins Herz trifft
              </h3>
              <p className="mb-4">
                "Ein Song ist mehr als nur Melodie und Takt – Musik ist der direkteste Weg zur menschlichen Seele. Vor wenigen Jahren war ein individuell geschriebener, professionell produzierter Song für private Anlässe unbezahlbar. Man brauchte Tonstudios, Studiomusiker und Tausende von Euro."
              </p>
              <p>
                Mit <strong>MyMusicMoment24</strong> habe ich mir zum Ziel gesetzt, diese Barriere komplett einzureißen: Jeder Mensch soll seinen Liebsten ein unverwechselbares Lied schenken können – mit echten Namen, privaten Anekdoten, Insider-Witzen und Meilensteinen – ab fairen <strong>19,99 €</strong>.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Wie entstehen die Songs?
              </h3>
              <p className="mb-3">
                Viele denken, KI spuckt auf Knopfdruck fertige Hits aus – die Realität ist jedoch viel anspruchsvoller:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Empathisches Texten:</strong> Eure persönlichen Geschichten werden in reimende Strophen und mitreißende Refrains gefasst.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Genre-Optimierung:</strong> Ob Discofox, gefühlvolle Akustik-Ballade, Deutschrap oder 80s Rock – das Sounddesign wird präzise gesteuert.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Persönliche Qualitätskontrolle:</strong> Wir hören uns jeden Song vor der Übergabe an, um zu prüfen, ob alles harmonisch passt – inklusive 1 kostenfreien Verbesserungsschleife für Eure Änderungswünsche.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-lg">Möchtest Du einen Song erstellen?</h4>
                <p className="text-sm text-slate-400">Wähle Deinen Anlass und erhalte Dein Lied in 24–48 Std. (Express unter 12 Std.).</p>
              </div>
              <button
                onClick={onGoToConfigurator}
                className="shrink-0 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/25 transition"
              >
                Song konfigurieren (19,99 €)
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Transparency */}
        <section className="border-t border-slate-800 pt-10 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Fragen oder individuelle Wünsche?</h3>
          <p className="text-sm text-slate-400 mb-6">
            Ich bin persönlich für Dich da – per E-Mail oder unkompliziert via WhatsApp.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@mymusicmoment24.de"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-orange-500 text-slate-200 text-sm font-medium transition"
            >
              <Mail className="w-4 h-4 text-orange-400" /> info@mymusicmoment24.de
            </a>
            <a
              href="https://wa.me/4915123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-sm font-medium transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
