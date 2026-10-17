import React from "react";

import { ArrowLeft, CheckCircle2, Music, Sparkles, Youtube, Heart, Award, ShieldCheck, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AuthorPage({ onBackToHome, onGoToConfigurator }) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-bold text-stone-900 hover:opacity-90 transition"
          >
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              className="w-7 h-7 object-contain"
            />
            <span>MyMusicMoment<span className="text-amber-500">24</span></span>
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-amber-50/50 via-white to-[#faf8f5] border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Über den Gründer & Musikproduzenten
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Dirk Schmetzer
          </h1>
          <p className="text-lg md:text-xl text-stone-600 font-light max-w-2xl mx-auto">
            Gründer von MyMusicMoment24. Ich mache aus euren Geschichten Songs, mit KI als Werkzeug und mit viel Herz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center h-fit shadow-xl shadow-stone-200/50">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-400 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <img
                src="/images/dirk-schmetzer.png"
                alt="Dirk Schmetzer, Gründer von MyMusicMoment24"
                className="relative w-32 h-32 rounded-full object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/20"
              />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Dirk Schmetzer</h2>
            <p className="text-sm text-amber-700 font-bold mb-4">Gründer &amp; Prompt-Engineer</p>
            
            <div className="flex flex-col gap-2.5 text-left text-xs text-stone-700 border-t border-stone-200 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href="https://www.sichtbarmitki.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>DS Online Services • sichtbarmitKI.agency</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Seit 2024 Songs für Familien, Paare & Vereine</span>
              </div>
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
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
          <div className="md:col-span-2 space-y-6 text-stone-700 leading-relaxed">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md shadow-stone-200/50">
              <h3 className="text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Warum ich das mache
              </h3>
              <p className="mb-4 text-stone-600">
                Ein Lied kann etwas sagen, das man sonst nur schwer über die Lippen bringt. Danke, ich liebe dich, ich bin stolz auf dich. Früher war ein eigener Song für private Anlässe kaum bezahlbar. Man brauchte ein Tonstudio, Musiker und viel Geld.
              </p>
              <p className="text-stone-600">
                Mit <strong>MyMusicMoment24</strong> möchte ich das ändern. Jeder soll einem Menschen, der ihm wichtig ist, ein eigenes Lied schenken können. Mit echten Namen, kleinen Geschichten und Insidern, die nur ihr kennt. Zu einem fairen Festpreis von <strong>19,99 €</strong>.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md shadow-stone-200/50">
              <h3 className="text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> So entsteht dein Song
              </h3>
              <p className="mb-3 text-stone-600">
                Viele denken, KI macht auf Knopfdruck einen fertigen Song. So einfach ist es nicht. Die KI ist ein Werkzeug, die Entscheidungen treffe ich. So läuft eine Bestellung ab:
              </p>
              <ol className="space-y-2.5 text-sm text-stone-700">
                {[
                  ["Du erzählst", "Im Konfigurator wählst du Anlass, Musikstil und Stimme und schreibst ein paar Sätze über die Person. Stichpunkte reichen."],
                  ["Text und Musik entstehen", "Aus deinen Angaben werden Strophen und ein Refrain, dazu Melodie und Gesang im gewählten Stil."],
                  ["Ich höre jeden Song an", "Stimmen die Namen, die Betonung und das Gefühl? Erst wenn das passt, geht der Song raus."],
                  ["Du bekommst deinen Song", "Als MP3 per E-Mail oder WhatsApp, meist innerhalb von 24 Stunden an Werktagen."],
                  ["Wenn etwas nicht passt", "Eine Änderungsrunde ist immer dabei. Sag mir einfach, was anders sein soll."],
                ].map(([title, text], idx) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span><strong>{title}:</strong> {text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md shadow-stone-200/50">
              <h3 className="text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" /> Ein ehrlicher Blick zurück und nach vorn
              </h3>
              <p className="mb-3 text-stone-600">
                Im vergangenen Jahr war es bei MyMusicMoment24 ruhiger. Bei mir war vieles im Umbruch, und deshalb sind in dieser Zeit nur wenige Songs entstanden. Die, die entstanden sind, habe ich mit derselben Sorgfalt gemacht wie immer. Das sieht man auch an den Bewertungen.
              </p>
              <p className="mb-3 text-stone-600">
                Die ruhigere Zeit habe ich genutzt, um vieles besser zu machen:
              </p>
              <ul className="space-y-1.5 text-sm text-stone-700 mb-3">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>eine neue, übersichtliche Website mit Hörproben und klaren Preisen</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>einen einfachen Konfigurator, mit dem du in 2 Minuten bestellst</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>sichere Bezahlung per PayPal, Karte oder Überweisung</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Ratgeber zu Hochzeit, Geburtstag, Jubiläum und vielen anderen Anlässen</span></li>
              </ul>
              <p className="text-stone-600">
                Jetzt geht es wieder richtig los. Mit neuer Energie, aber mit demselben Anspruch wie am Anfang: Jeder Song soll sich anfühlen, als wäre er nur für diesen einen Menschen geschrieben. Weil er das ist.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/60 border-2 border-amber-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Möchtest du einen Song verschenken?</h3>
                <p className="text-sm text-stone-600">Wähle deinen Anlass. Dein Lied ist meist in 24 Stunden fertig, mit Express in 12 Stunden.</p>
              </div>
              <button
                onClick={onGoToConfigurator}
                className="shrink-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                Song konfigurieren (19,99 €)
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Transparency */}
        <section className="border-t border-stone-200 pt-10 text-center">
          <h3 className="text-lg font-bold text-stone-900 mb-2">Fragen oder individuelle Wünsche?</h3>
          <p className="text-sm text-stone-600 mb-6">
            Schreib mir einfach. Ich antworte persönlich, per E-Mail oder WhatsApp.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@mymusicmoment24.de"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-amber-500 text-stone-800 text-sm font-medium transition shadow-sm"
            >
              <Mail className="w-4 h-4 text-amber-600" /> info@mymusicmoment24.de
            </a>
            <a
              href="https://wa.me/4915906122744"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-sm font-semibold transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
