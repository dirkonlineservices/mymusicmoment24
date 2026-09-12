import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Sparkles, CheckCircle2, Music, Radio, Disc, Globe, 
  ShieldCheck, ArrowRight, Clock, Share2, Headphones, Award, Heart,
  Copy, Check
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalBadge, StripeBadge, ApplePayBadge, SepaBadge, DebitCardBadge } from "../components/PaymentBadges";
import { trackPurchase } from "../lib/gtmPreview";

export default function StreamingReleasePage({ onBackToHome }) {
  const { language } = useLanguage();
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  // Form states for DistroKid upload
  const [formData, setFormData] = useState({
    songTitle: "",
    genre: "Pop",
    songLanguage: "Deutsch",
    explicitLyrics: false,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    originalOrderNumber: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check for Stripe return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("stripe_success") === "true" && urlParams.get("session_id")) {
      const sessionId = urlParams.get("session_id");
      setIsProcessing(true);
      fetch("/api/verify-stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setCompletedOrder(data.order);
            trackPurchase(data.order.transactionId || sessionId, {
              price: 4.99,
              name: data.order.orderName || "Spotify & Streaming Release",
              id: "streaming-release",
            });
          }
        })
        .catch((err) => {
          console.error("Stripe Verification Error:", err);
          setErrorMessage(language === "en" ? "Error verifying Stripe session." : "Fehler beim Verifizieren der Zahlung.");
        })
        .finally(() => {
          setIsProcessing(false);
          window.history.replaceState({}, "", "/streaming");
        });
    } else if (urlParams.get("stripe_cancel") === "true") {
      setErrorMessage(language === "en" ? "Payment was cancelled. You can try again anytime." : "Die Zahlung wurde abgebrochen. Du kannst es jederzeit erneut versuchen.");
      window.history.replaceState({}, "", "/streaming");
    }
  }, [language]);

  const genres = [
    { value: "Pop", label: "Pop / Modern Pop" },
    { value: "Ballade", label: "Ballade / Akustik & Emotion" },
    { value: "Deutschrap", label: "Deutschrap / Hip-Hop" },
    { value: "Schlager", label: "Schlager / Partymusik" },
    { value: "Dance / EDM", label: "Dance / Electronic (EDM)" },
    { value: "Rock", label: "Rock / Pop-Rock" },
    { value: "R&B / Soul", label: "R&B / Soul" },
    { value: "Kinderlied", label: "Kinderlied / Family" },
    { value: "Sonstiges", label: "Sonstiges / Individuell" },
  ];

  // Helper to compile DistroKid text for clipboard copy
  const getDistroKidCopyText = (order) => {
    const details = order?.orderDetails || {};
    const title = details.songTitle || formData.songTitle || "Song";
    const g = details.genre || formData.genre || "Pop";
    const lang = details.language || formData.songLanguage || "Deutsch";
    const exp = details.explicitLyrics !== undefined ? (details.explicitLyrics ? "Ja (Explicit)" : "Nein (Clean)") : (formData.explicitLyrics ? "Ja (Explicit)" : "Nein (Clean)");
    const name = order?.customerName || formData.customerName || "Kunde";
    const email = order?.customerEmail || formData.customerEmail || "";
    const phone = order?.customerPhone || formData.customerPhone || "Keine";
    const ref = details.originalOrderNumber || formData.originalOrderNumber || "Keine Angabe";
    const n = details.notes || formData.notes || "Keine besonderen Wünsche";
    const tx = order?.transactionId || "N/A";

    return `=== DISTROKID UPLOAD-DATEN ===
Artist Name: MyMusicMoment24
Song Title: ${title}
Primary Genre: ${g}
Language: ${lang}
Explicit Lyrics: ${exp}
Customer: ${name} <${email}>
Phone/WhatsApp: ${phone}
Order Reference: ${ref}
Notes / Artwork: ${n}
Transaction-ID: ${tx}
Amount Paid: 4,99 €
==============================`;
  };

  const handleCopyDistroKidData = () => {
    if (!completedOrder) return;
    const text = getDistroKidCopyText(completedOrder);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error("Copy failed", err);
    });
  };

  // Stripe Checkout Initiator
  const handleStripeCheckout = async () => {
    if (!formData.songTitle.trim()) {
      alert(language === "en" ? "Please enter the song title for Spotify." : "Bitte gib den gewünschten Songtitel für Spotify an.");
      return;
    }
    if (!formData.customerName.trim()) {
      alert(language === "en" ? "Please enter your full name." : "Bitte gib deinen Namen an.");
      return;
    }
    if (!formData.customerEmail.trim()) {
      alert(language === "en" ? "Please enter your email address." : "Bitte gib deine E-Mail-Adresse an.");
      return;
    }
    if (!agreedTerms) {
      alert(language === "en" ? "Please agree to the terms and privacy policy." : "Bitte bestätige die AGB und den Beginn der sofortigen Ausführung.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 4.99,
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          songDetailsText: `Wunsch-Songtitel: ${formData.songTitle}\nGenre: ${formData.genre}\nSprache: ${formData.songLanguage}\nNotizen: ${formData.notes}`,
          orderName: `Spotify & Streaming Release: „${formData.songTitle}“`,
          isStreaming: true,
          orderDetails: {
            occasion: "streaming-release",
            genre: formData.genre,
            language: formData.songLanguage,
            explicitLyrics: formData.explicitLyrics,
            songTitle: formData.songTitle,
            originalOrderNumber: formData.originalOrderNumber,
            notes: formData.notes,
            express: false,
            pdfLyrics: false,
          },
          successUrl: `${window.location.origin}/streaming?stripe_success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/streaming?stripe_cancel=true`,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || "Fehler beim Starten von Stripe. Bitte prüfe die Konfiguration.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Stripe Error:", err);
      setErrorMessage(language === "en" ? "Network error connecting to Stripe." : "Verbindungsfehler zu Stripe. Bitte erneut versuchen.");
      setIsProcessing(false);
    }
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* View A: Success / Confirmation Screen with DistroKid Copy Button */}
        {completedOrder ? (
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {language === "en" ? "Payment Successful! Streaming Release Booked" : "Zahlung über 4,99 € erfolgreich!"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {language === "en" 
                  ? "We received your streaming release order and sent a confirmation email. Production and DistroKid distribution are starting now." 
                  : "Wir haben deinen Streaming-Auftrag erhalten. Eine Bestätigungs-E-Mail wurde an dich und die Benachrichtigung an unser Team versendet."}
              </p>
              <div className="mt-3 inline-block bg-slate-800/80 px-3 py-1 rounded-lg text-xs font-mono text-emerald-300 border border-slate-700">
                Tx-ID: {completedOrder.transactionId || "N/A"}
              </div>
            </div>

            {/* DistroKid Box with 1-Click Copy */}
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    DistroKid Upload-Daten
                  </span>
                  <span className="text-xs text-slate-400">
                    {language === "en" ? "Ready to copy into DistroKid distribution:" : "Sofort bereit zum Übertragen & Rauskopieren:"}
                  </span>
                </div>
                <button
                  onClick={handleCopyDistroKidData}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shrink-0 shadow-lg shadow-emerald-500/20"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === "en" ? "Copied to Clipboard!" : "In Zwischenablage kopiert! ✅"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{language === "en" ? "Copy DistroKid Data" : "📋 DistroKid-Daten kopieren"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Artist Name (Künstler):</span>
                  <span className="font-bold text-white text-sm">MyMusicMoment24</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Song Title (Titel auf Spotify):</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {completedOrder.orderDetails?.songTitle || formData.songTitle || "Song"}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Primary Genre:</span>
                  <span className="font-semibold text-slate-200">
                    {completedOrder.orderDetails?.genre || formData.genre || "Pop"}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Language / Explicit:</span>
                  <span className="font-semibold text-slate-200">
                    {completedOrder.orderDetails?.language || formData.songLanguage} • {formData.explicitLyrics ? "Explicit" : "Clean"}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Kunde / Kontakt:</span>
                  <span className="font-semibold text-slate-200">
                    {completedOrder.customerName} ({completedOrder.customerEmail})
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Bestell-Referenz:</span>
                  <span className="font-semibold text-slate-200">
                    {completedOrder.orderDetails?.originalOrderNumber || formData.originalOrderNumber || "Keine"}
                  </span>
                </div>
              </div>

              {/* Monospace Raw Text Box */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-300">
                <pre className="whitespace-pre-wrap leading-relaxed select-all">
                  {getDistroKidCopyText(completedOrder)}
                </pre>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-6 text-xs text-slate-300 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {language === "en" ? "What happens now?" : "Wie geht es nun weiter?"}
              </h4>
              <p>1. 🎨 <strong>Cover-Artwork:</strong> Wir erstellen das 3000x3000px Titelbild für deinen Release.</p>
              <p>2. 🚀 <strong>DistroKid-Upload:</strong> Wir laden den Track hoch und vergeben die weltweiten ISRC-Codes.</p>
              <p>3. ⏳ <strong>Verfügbarkeit:</strong> Innerhalb von 2–5 Werktagen ist dein Song auf Spotify, Apple Music & Co. live.</p>
              <p>4. 📩 <strong>Streaming-Link:</strong> Wir senden dir den offiziellen Spotify-Link direkt per E-Mail zu!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setFormData({
                    songTitle: "",
                    genre: "Pop",
                    songLanguage: "Deutsch",
                    explicitLyrics: false,
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                    originalOrderNumber: "",
                    notes: "",
                  });
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition text-center"
              >
                {language === "en" ? "Submit Another Song" : "Weiteren Release anlegen"}
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition text-center"
              >
                {language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}
              </button>
            </div>
          </div>
        ) : (

          /* View B: The Booking Form with Integrated PayPal and Stripe Checkout */
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "en" ? "Streaming Upload Form" : "DistroKid Upload-Formular"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {language === "en" ? "Release Your Song on Spotify & Co." : "Jetzt Song auf Spotify & Co. bringen"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {language === "en"
                  ? "Fixed one-time price of €4.99 • Official artist profile 'MyMusicMoment24' • Direct checkout via PayPal or Stripe"
                  : "Einmalig 4,99 € Festpreis • Offizielles Profil „MyMusicMoment24“ • Direkt sicher per PayPal oder Kreditkarte"}
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-5">
              
              {/* Section 1: Song & DistroKid Details */}
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5" />
                  <span>1. Song & DistroKid-Angaben</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === "en" ? "Song Title on Spotify *" : "Wunsch-Songtitel auf Spotify & Apple Music *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Für immer wir (Lisa & Max)"
                    value={formData.songTitle}
                    onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {language === "en" 
                      ? "Will be published as: 'MyMusicMoment24 – [Your Song Title]'" 
                      : "Erscheint als: „MyMusicMoment24 – [Dein Songtitel]“"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Primary Genre *" : "Musikrichtung (Genre) *"}
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      {genres.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Song Language" : "Sprache der Lyrics"}
                    </label>
                    <select
                      value={formData.songLanguage}
                      onChange={(e) => setFormData({ ...formData, songLanguage: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Deutsch">Deutsch</option>
                      <option value="Englisch">Englisch</option>
                      <option value="Spanisch">Spanisch</option>
                      <option value="Italienisch">Italienisch</option>
                      <option value="Sonstige">Sonstige</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.explicitLyrics}
                      onChange={(e) => setFormData({ ...formData, explicitLyrics: e.target.checked })}
                      className="rounded bg-slate-700 border-slate-600 text-emerald-500 w-4 h-4 shrink-0"
                    />
                    <span>{language === "en" ? "Contains explicit language / profanity" : "Enthält explizite Sprache (Schimpfwörter) [Explicit Tag]"}</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Customer Contact & Order Reference */}
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>2. Kontaktdaten & Zuordnung</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Your Full Name *" : "Dein Vor- & Nachname *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Max Mustermann"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Your Email Address *" : "Deine E-Mail-Adresse *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="deine-email@beispiel.de"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Phone / WhatsApp (optional)" : "Telefon / WhatsApp (optional)"}
                    </label>
                    <input
                      type="tel"
                      placeholder="+49 170 1234567"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {language === "en" ? "Order ID or Song Theme" : "Ursprungs-Bestell-Nr. oder Song-Thema"}
                    </label>
                    <input
                      type="text"
                      placeholder="z. B. Hochzeitssong Sarah & Tim"
                      value={formData.originalOrderNumber}
                      onChange={(e) => setFormData({ ...formData, originalOrderNumber: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === "en" ? "Notes / Cover Wishes (optional)" : "Besondere Notizen / Cover-Wünsche (optional)"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === "en" ? "Special notes for the artwork..." : "z. B. Foto-Wunsch oder Widmung fürs Cover..."}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 3: Payment Method Selection & Checkout Directly on the Page */}
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>3. Zahlungsart wählen (4,99 €)</span>
                  </h4>
                  <span className="text-lg font-black text-white">4,99 €</span>
                </div>

                {/* PayPal Express Option */}
                <label className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${paymentMethod === "paypal" ? "bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/25 border-amber-400 text-white shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/50" : "bg-slate-800/90 border-slate-600 text-white hover:bg-gradient-to-r hover:from-amber-500/20 hover:via-yellow-400/15 hover:to-amber-500/20 hover:border-amber-300 hover:shadow-lg"}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="text-amber-500 w-4 h-4 mt-0.5 shrink-0 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-xs sm:text-sm">PayPal Express & SEPA</span>
                        <span className="px-1.5 py-0.5 bg-emerald-400 text-slate-950 text-[9px] font-black rounded">Ohne Konto möglich</span>
                      </div>
                      <span className="text-[11px] text-amber-100/90 block mt-0.5 font-medium">Mit PayPal-Konto oder ganz ohne Konto per SEPA-Bankeinzug / Debitkarte</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1">
                      <PayPalBadge className="h-4" />
                      <SepaBadge className="h-4" />
                    </div>
                    <DebitCardBadge className="h-3.5" />
                  </div>
                </label>

                {/* Stripe Option */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === "stripe" ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10" : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600"}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="text-emerald-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm block">Kreditkarte / Apple Pay / Klarna</span>
                      <span className="text-[11px] text-slate-400">Direkte Zahlung via Stripe Checkout</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 scale-90 sm:scale-100">
                    <StripeBadge className="h-4" />
                    <ApplePayBadge className="h-4" />
                  </div>
                </label>

                {/* Legal Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-400">
                    <input
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="rounded bg-slate-700 border-slate-600 text-emerald-500 mt-0.5 w-4 h-4 shrink-0"
                    />
                    <span>
                      Ich stimme den Allgemeinen Geschäftsbedingungen (AGB) und der Datenschutzerklärung zu. Ich beauftrage die sofortige Veröffentlichung auf den Streaming-Plattformen und nehme zur Kenntnis, dass das Widerrufsrecht bei individueller digitaler Erstellung erlischt.
                    </span>
                  </label>
                </div>

                {/* Validation Reminder */}
                {(!formData.songTitle || !formData.customerName || !formData.customerEmail || !agreedTerms) && (
                  <p className="text-[11px] text-amber-400/90 text-center py-2 px-3 bg-amber-500/10 rounded-xl border border-amber-500/20 font-medium">
                    💡 Bitte Songtitel, Name, E-Mail ausfüllen und das AGB-Kästchen abhaken, um die Zahlung zu aktivieren.
                  </p>
                )}

                {/* Direct Payment Execution Buttons */}
                <div className="pt-2">
                  {paymentMethod === "paypal" ? (
                    <div>
                      {paypalClientId ? (
                        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                          <PayPalButtons
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                            disabled={!formData.songTitle || !formData.customerName || !formData.customerEmail || !agreedTerms || isProcessing}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    description: `Spotify & Streaming Release: ${formData.songTitle}`.substring(0, 120),
                                    amount: {
                                      currency_code: "EUR",
                                      value: "4.99",
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={async (data, actions) => {
                              setIsProcessing(true);
                              try {
                                const details = await actions.order.capture();
                                const txId = details.id || `PAYPAL-${Date.now()}`;
                                const orderData = {
                                  transactionId: txId,
                                  paymentProvider: "paypal",
                                  amount: "4.99",
                                  customerEmail: formData.customerEmail,
                                  customerName: formData.customerName,
                                  customerPhone: formData.customerPhone,
                                  songDetailsText: `Wunsch-Songtitel: ${formData.songTitle}\nGenre: ${formData.genre}\nSprache: ${formData.songLanguage}\nNotizen: ${formData.notes}`,
                                  orderName: `Spotify & Streaming-Release: „${formData.songTitle}“`,
                                  category: "streaming",
                                  orderDetails: {
                                    occasion: "streaming-release",
                                    genre: formData.genre,
                                    language: formData.songLanguage,
                                    explicitLyrics: formData.explicitLyrics,
                                    songTitle: formData.songTitle,
                                    originalOrderNumber: formData.originalOrderNumber,
                                    notes: formData.notes,
                                    express: false,
                                    pdfLyrics: false,
                                  },
                                  payer: details.payer,
                                };

                                await fetch("/api/orders", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(orderData),
                                });

                                setCompletedOrder(orderData);
                                trackPurchase(txId, {
                                  price: 4.99,
                                  name: orderData.orderName,
                                  id: "streaming-release",
                                });
                              } catch (err) {
                                console.error("PayPal Error:", err);
                                alert("Zahlungsfehler bei PayPal. Bitte erneut versuchen.");
                              } finally {
                                setIsProcessing(false);
                              }
                            }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <p className="text-xs text-red-400 text-center">PayPal Client ID nicht konfiguriert.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStripeCheckout}
                      disabled={!formData.songTitle || !formData.customerName || !formData.customerEmail || !agreedTerms || isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>
                        {isProcessing ? "Verbindung zu Stripe..." : "Mit Kreditkarte / Apple Pay zahlen (4,99 €)"}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sichere 256-Bit SSL-Verschlüsselung • Keine Abos oder versteckte Gebühren</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}