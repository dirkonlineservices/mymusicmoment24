import React, { useState } from "react";
import { 
  ArrowLeft, Sparkles, CheckCircle2, Music, Radio, Disc, Globe, 
  ShieldCheck, ArrowRight, Clock, Share2, Headphones, Award, Heart
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function StreamingReleasePage({ onBackToHome, onOpenCheckout }) {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    customerEmail: "",
    customerName: "",
    originalOrderNumber: "",
    songTitle: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerEmail) {
      alert(language === "en" ? "Please enter your email address." : "Bitte gib deine E-Mail-Adresse an.");
      return;
    }
    if (!formData.songTitle) {
      alert(language === "en" ? "Please enter the title for Spotify & Co." : "Bitte gib den gewünschten Songtitel für Spotify & Co. an.");
      return;
    }

    const streamingOrder = {
      id: `streaming-${Date.now()}`,
      name: language === "en" 
        ? `Spotify & Streaming Release: "${formData.songTitle}"` 
        : `Spotify & Streaming-Release: „${formData.songTitle}“`,
      price: 4.99,
      category: "streaming",
      details: {
        occasion: "streaming-release",
        genre: "Streaming-Upload (Spotify, Apple Music & YouTube Music)",
        voice: "Release unter „MyMusicMoment24“",
        language: language === "en" ? "English" : "Deutsch",
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        originalOrderNumber: formData.originalOrderNumber,
        songTitle: formData.songTitle,
        notes: formData.notes,
        express: false,
        pdfLyrics: false,
      },
    };

    onOpenCheckout(streamingOrder);
  };

  const platforms = [
    { name: "Spotify", color: "bg-[#1DB954]/15 border-[#1DB954]/30 text-[#1DB954]" },
    { name: "Apple Music", color: "bg-[#FA243C]/15 border-[#FA243C]/30 text-[#FA243C]" },
    { name: "YouTube Music", color: "bg-[#FF0000]/15 border-[#FF0000]/30 text-[#FF0000]" },
    { name: "Amazon Music", color: "bg-[#00A8E1]/15 border-[#00A8E1]/30 text-[#00A8E1]" },
    { name: "Deezer", color: "bg-[#A238FF]/15 border-[#A238FF]/30 text-[#A238FF]" },
    { name: "TikTok / Instagram", color: "bg-[#FE2C55]/15 border-[#FE2C55]/30 text-[#FE2C55]" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 text-sm font-bold text-white hover:opacity-90 transition"
          >
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="hidden sm:inline">MyMusicMoment<span className="text-amber-400">24</span></span>
          </button>

          <div className="scale-90 sm:scale-100">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Radio className="w-4 h-4" />
            <span>{language === "en" ? "Exclusive After-Sales Service" : "Exklusiver Release-Service für Kunden"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {language === "en" ? (
              <>Your Custom Song on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Spotify & Co.</span></>
            ) : (
              <>Dein persönlicher Song auf <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Spotify, Apple Music & YouTube</span></>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            {language === "en" 
              ? "Make your customized song permanently available worldwide. We handle the entire release process through our music distribution network (DistroKid) under our verified artist label 'MyMusicMoment24' — for a one-time fee of only €4.99."
              : "Mache deinen persönlichen Song weltweit auf allen großen Plattformen streambar! Wir übernehmen den kompletten Veröffentlichungsprozess über unseren Musikvertrieb (DistroKid) unter unserem offiziellen Künstlerprofil „MyMusicMoment24“ – dauerhaft online für einmalig nur 4,99 €."}
          </p>

          {/* Platform Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {platforms.map((p, idx) => (
              <span
                key={idx}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-sm backdrop-blur-md ${p.color}`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Features / Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-2">
              {language === "en" ? "Worldwide Distribution" : "Weltweit verfügbar"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === "en"
                ? "Your song can be found, streamed, and added to playlists on Spotify, Apple Music, YouTube Music, Deezer, and TikTok."
                : "Dein Song wird suchbar auf Spotify, Apple Music, YouTube Music, Deezer und in der Instagram/TikTok-Sound-Bibliothek."}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <Disc className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-2">
              {language === "en" ? "Official Release Label" : "Offizielles Künstlerprofil"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === "en"
                ? "Published under 'MyMusicMoment24' (e.g. MyMusicMoment24 – Your Song Title) including cover artwork & ISRC codes."
                : "Erscheint offiziell unter unserem verifizierten Künstlerprofil „MyMusicMoment24“ inklusive professionellem Cover-Artwork & ISRC-Codes."}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base sm:text-lg mb-2">
              {language === "en" ? "One-Time €4.99 • No Subscriptions" : "Einmalig 4,99 € • Kein Abo"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {language === "en"
                ? "Pay once, stay online forever. No hidden monthly distributor fees or renewal fees."
                : "Einmaliger Festpreis ohne laufende Kosten. Dein Song bleibt dauerhaft auf den Streaming-Diensten online."}
            </p>
          </div>
        </div>

        {/* How It Works Process */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3 inline-block">
              {language === "en" ? "Process Overview" : "So einfach funktioniert's"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "en" ? "From Song Creation to Spotify" : "In 3 Schritten zur weltweiten Veröffentlichung"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  {language === "en" ? "Submit Details & Order" : "Angaben & Buchung (4,99 €)"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "Fill out the form below with your song title, recipient name, and order email."
                    : "Fülle unten das kurze Formular mit deinem Wunsch-Songtitel und deiner E-Mail-Adresse aus."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  {language === "en" ? "Cover & DistroKid Upload" : "Artwork & DistroKid-Upload"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "We generate the 3000x3000px artwork, master the audio, and distribute via DistroKid to all stores."
                    : "Wir erstellen das offizielle Cover-Artwork, prüfen die Audio-Metadaten und übermitteln den Song via DistroKid."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  {language === "en" ? "Live in 2–5 Days" : "Live in ca. 2–5 Werktagen"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "Spotify and Apple Music review and publish the song. You'll receive your direct streaming links via email!"
                    : "Sobald die Plattformen den Song freigegeben haben, senden wir dir deinen offiziellen Spotify-Link per E-Mail zu!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form & Checkout Box */}
        <div id="booking-form" className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "en" ? "Book Streaming Upload" : "Streaming-Release beauftragen"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {language === "en" ? "Release Your Song Worldwide" : "Jetzt Song auf Spotify & Co. bringen"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === "en"
                ? "One-time €4.99 fixed fee • Permanent streaming presence • No subscriptions"
                : "Einmalig 4,99 € Festpreis • Dauerhafte Präsenz auf allen Plattformen • Kein Abo"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === "en" ? "Your Email Address (from original song order) *" : "Deine E-Mail-Adresse (von der Song-Bestellung) *"}
              </label>
              <input
                type="email"
                required
                placeholder="deine-email@beispiel.de"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === "en" ? "Your Name *" : "Dein Vor- & Nachname *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Max Mustermann"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === "en" ? "Order ID / Song Theme (optional)" : "Bestell-Nr. oder Song-Thema (optional)"}
                </label>
                <input
                  type="text"
                  placeholder="z. B. Geburtstagssong für Sarah"
                  value={formData.originalOrderNumber}
                  onChange={(e) => setFormData({ ...formData, originalOrderNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === "en" ? "Song Title on Spotify & Apple Music *" : "Wunsch-Songtitel auf Spotify & Co. *"}
              </label>
              <input
                type="text"
                required
                placeholder="z. B. Für immer wir (Lisa & Max)"
                value={formData.songTitle}
                onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === "en" 
                  ? "Appears as: 'MyMusicMoment24 – [Your Song Title]'" 
                  : "Wird auf Spotify angezeigt als: „MyMusicMoment24 – [Dein Songtitel]“"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === "en" ? "Notes / Subtitle / Dedication (optional)" : "Besondere Wünsche / Widmung (optional)"}
              </label>
              <textarea
                rows={2}
                placeholder={language === "en" ? "Any special requests or dedication..." : "Besondere Anmerkungen für das Artwork..."}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Price Banner & Checkout CTA */}
            <div className="pt-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">{language === "en" ? "All-Inclusive Fixed Price" : "Einmaliger Komplettpreis"}</span>
                  <span className="text-2xl sm:text-3xl font-black text-white">4,99 €</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  {language === "en" ? "Lifetime Online" : "Dauerhaft online"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>{language === "en" ? "Order Streaming Release (4.99 €)" : "Jetzt Streaming-Release beauftragen (4,99 €)"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}