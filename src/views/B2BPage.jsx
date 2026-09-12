import React, { useState } from "react";
import { 
  ArrowLeft, Sparkles, Building2, Briefcase, Megaphone, Music, 
  CheckCircle2, Send, Clock, ShieldCheck, Mail, MessageSquare, 
  ArrowRight, Users, Radio, Award
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function B2BPage({ onBackToHome, onGoToConfigurator }) {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    phone: "",
    inquiryType: "Singende Werbeanzeigen & Social Ads",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.contactName || !formData.companyName || !formData.email || !formData.message) {
      setErrorMessage("Bitte füllen Sie alle erforderlichen Pflichtfelder (Name, Firma, E-Mail, Nachricht) aus.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/b2b-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          contactName: "",
          companyName: "",
          email: "",
          phone: "",
          inquiryType: "Singende Werbeanzeigen & Social Ads",
          message: "",
        });
      } else {
        setErrorMessage(data.error || "Beim Versenden der Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per WhatsApp.");
      }
    } catch (err) {
      console.error("B2B Inquiry error:", err);
      // Fallback: Show success if network proxy issue, with note
      setErrorMessage("Netzwerkfehler beim Absenden. Bitte kontaktieren Sie uns direkt per WhatsApp (01590 6122744) oder E-Mail (info@mymusicmoment24.de).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
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
      <section className="relative py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> B2B &amp; Agentur-Partnerprogramm • DS Online Services
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Singende Produktwerbung, Jingles &amp; Audio-Content mit KI
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Verwandle Produkte, Brand-Storys und Werbekampagnen in virale Ohrwürmer. Maßgeschneiderter Audio-Content für Agenturen, E-Commerce-Marken und Unternehmen – mit vollen kommerziellen Nutzungsrechten.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kommerzielle Lizenz inklusive
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Turnaround ab 24 Stunden
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" /> White-Label &amp; Agenturrabatte
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        
        {/* 4 B2B Use Cases */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Wie Agenturen &amp; Marken unsere Musik nutzen
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
              Hochwertiger KI-gestützter Audio-Content hebt Werbekampagnen von der Masse ab und bleibt im Kopf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Singende Produktbeschreibungen */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Singende Produktbeschreibungen &amp; Social Ads</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Klassische Voiceover-Ads werden auf TikTok, Instagram Reels und YouTube Shorts oft nach 2 Sekunden weggekippt. Ein maßgeschneiderter Song mit Produktnamen und Vorteilen als Hook stoppt das Weiterscrollen sofort und vervielfacht die Conversion-Rate.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Perfekt für E-Commerce, D2C-Brands &amp; Dropshipping
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Viral optimierte Songstrukturen (15s, 30s &amp; 60s)
                </li>
              </ul>
            </div>

            {/* Card 2: Marken-Jingles & Soundlogos */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Audio-Branding &amp; Marken-Jingles</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Stärke die Wiedererkennung deiner Marke mit einem individuellen Soundlogo oder Opener-Jingle für Podcasts, Imagefilme, YouTube-Kanäle und Radiowerbung. Kurze, prägnante Melodien, die deine Markenbotschaft akustisch verankern.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Jingles in 5–15 Sekunden mit Voice &amp; Claim
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Beliebige Genres von Modern Corporate bis Rock
                </li>
              </ul>
            </div>

            {/* Card 3: Mitarbeiter- & Firmensongs */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Firmenjubiläen, Mitarbeiter-Incentives &amp; Hymnen</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Feiere das 10-, 25- oder 50-jährige Firmenbestehen mit einer eigenen Unternehmenshymne. Oder überrasche verdiente Mitarbeiter beim Abschied in den Ruhestand oder bei der Weihnachtsfeier mit einem persönlichen Song über das gesamte Team.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Einbindung von Firmennamen, Meilensteinen &amp; Werten
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Emotionaler Höhepunkt für jede Betriebsfeier
                </li>
              </ul>
            </div>

            {/* Card 4: White-Label & Agentur-Partner */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Laufende Agentur-Partnerschaft &amp; White-Label</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Erweitere das Service-Portfolio deiner Agentur ohne eigene Musikproduzenten oder Audiotechniker. Wir liefern im Hintergrund maßgeschneiderte Audio-Kreationen – du verkaufst sie mit deiner eigenen Marge und unter deinem Namen an deine Kunden.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Attraktive Staffelpreise ab mehreren Tracks pro Monat
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Fester Ansprechpartner &amp; Prioritäts-Produktion
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Agency Synergie Note */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Teil von DS Online Services
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              SichtbarmitKI.agency – Deine Partner-Agentur für KI-Sichtbarkeit
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              MyMusicMoment24 ist ein spezialisierter Audio-Service von <strong>Dirk Schmetzer (DS Online Services)</strong>. Neben Musikproduktion unterstützen wir Unternehmen auch bei ganzheitlicher KI-Sichtbarkeit, Content-Strategie und digitalem Marketing.
            </p>
          </div>
          <a
            href="https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20B2B-Kooperation%20bei%20MyMusicMoment24."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp-Direktkontakt</span>
          </a>
        </div>

        {/* B2B Contact Form */}
        <section id="kooperationsformular" className="max-w-3xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Unverbindliche Anfrage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Kooperationsanfrage stellen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Teile uns deine Projektidee oder deinen Kooperationswunsch mit. Wir melden uns innerhalb von 24 Stunden mit einem maßgeschneiderten Angebot.
            </p>
          </div>

          {submitSuccess ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Vielen Dank für Ihre Anfrage!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Wir haben Ihre Kooperationsanfrage erhalten. Dirk Schmetzer wird sich innerhalb von 24 Stunden per E-Mail oder Telefon bei Ihnen melden.
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
              >
                Weitere Anfrage senden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ihr Name / Ansprechpartner <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Julia Weber"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Firma / Agentur <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. MediaBoost Agency GmbH"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Geschäftliche E-Mail <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@firma.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Telefon / WhatsApp (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="z.B. 0170 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Art der gewünschten Kooperation <span className="text-amber-400">*</span>
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                >
                  <option value="Singende Werbeanzeigen & Social Ads">Singende Werbeanzeigen &amp; Social Ads (TikTok/Reels)</option>
                  <option value="Marken-Jingle & Audio-Branding">Marken-Jingle &amp; Audio-Branding (Soundlogo)</option>
                  <option value="Firmen- / Jubiläumssong & Team-Hymne">Firmen- / Jubiläumssong &amp; Team-Hymne</option>
                  <option value="Laufende Agentur-Partnerschaft (White-Label)">Laufende Agentur-Partnerschaft (White-Label)</option>
                  <option value="Sonstige individuelle B2B-Kooperation">Sonstige individuelle B2B-Kooperation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Projektdetails &amp; Wünsche <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Beschreiben Sie kurz Ihr Projekt, gewünschte Stückzahl, Zielgruppe oder Fristen..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Anfrage wird übermittelt...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kooperationsanfrage jetzt kostenlos absenden</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Ihre Daten werden vertraulich behandelt und ausschließlich zur Beantwortung Ihrer Anfrage genutzt.
              </p>
            </form>
          )}

          {/* Direct Contact Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>info@mymusicmoment24.de</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: 01590 6122744</span>
            </div>
            <div>
              <span className="text-slate-500">Stuttgart (Deutschland)</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
