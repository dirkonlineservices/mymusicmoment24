import { useState, useEffect } from "react";
import { 
  ArrowLeft, Sparkles, CheckCircle2, Music, Radio, Disc, Globe, 
  ShieldCheck, ArrowRight, Award, Heart,
  Copy, Check
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PRICES } from "../lib/pricing";
import { createPayPalOrder, capturePayPalOrder } from "../lib/paypalServer";
import { PayPalBadge, StripeBadge, ApplePayBadge, SepaBadge, DebitCardBadge } from "../components/PaymentBadges";
import { trackPurchase } from "../lib/gtmPreview";
import SchemaJsonLd from "../components/SchemaJsonLd";

export default function StreamingReleasePage({ onBackToHome }) {
  const { language, lp } = useLanguage();
  const en = language === "en";
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
          setErrorMessage(language === "en" ? "Error while verifying the payment." : "Fehler beim Verifizieren der Zahlung.");
        })
        .finally(() => {
          setIsProcessing(false);
          window.history.replaceState({}, "", lp("/streaming"));
        });
    } else if (urlParams.get("stripe_cancel") === "true") {
      setErrorMessage(language === "en" ? "Payment was cancelled. You can try again anytime." : "Die Zahlung wurde abgebrochen. Du kannst es jederzeit erneut versuchen.");
      window.history.replaceState({}, "", lp("/streaming"));
    }
  }, [language]);

  const genres = [
    { value: "Pop", label: "Pop / Modern Pop" },
    { value: "Ballade", label: en ? "Ballad / Acoustic & Emotional" : "Ballade / Akustik & Emotion" },
    { value: "Deutschrap", label: en ? "German rap / Hip-hop" : "Deutschrap / Hip-Hop" },
    { value: "Schlager", label: en ? "Schlager / Party music" : "Schlager / Partymusik" },
    { value: "Dance / EDM", label: "Dance / Electronic (EDM)" },
    { value: "Rock", label: "Rock / Pop-Rock" },
    { value: "R&B / Soul", label: "R&B / Soul" },
    { value: "Kinderlied", label: en ? "Children's song / Family" : "Kinderlied / Family" },
    { value: "Sonstiges", label: en ? "Other / Custom" : "Sonstiges / Individuell" },
  ];

  // Helper to compile DistroKid text for clipboard copy
  const getDistroKidCopyText = (order) => {
    const details = order?.orderDetails || {};
    const title = details.songTitle || formData.songTitle || "Song";
    const g = details.genre || formData.genre || "Pop";
    const lang = details.language || formData.songLanguage || "Deutsch";
    const yes = en ? "Yes (Explicit)" : "Ja (Explicit)";
    const no = en ? "No (Clean)" : "Nein (Clean)";
    const exp = details.explicitLyrics !== undefined ? (details.explicitLyrics ? yes : no) : (formData.explicitLyrics ? yes : no);
    const name = order?.customerName || formData.customerName || (en ? "Customer" : "Kunde");
    const email = order?.customerEmail || formData.customerEmail || "";
    const phone = order?.customerPhone || formData.customerPhone || (en ? "None" : "Keine");
    const ref = details.originalOrderNumber || formData.originalOrderNumber || (en ? "Not given" : "Keine Angabe");
    const n = details.notes || formData.notes || (en ? "No special requests" : "Keine besonderen Wünsche");
    const tx = order?.transactionId || "N/A";

    return `=== DISTROKID ${en ? "UPLOAD DATA" : "UPLOAD-DATEN"} ===
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
Amount Paid: ${en ? "€4.99" : "4,99 €"}
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
  // Bestelldaten für den Server (Betrag berechnet der Server)
  const streamingPayload = () => ({
    locale: language,
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
  });

  const handleStripeCheckout = async () => {
    if (!formData.songTitle.trim()) {
      alert(language === "en" ? "Please enter the song title you want on Spotify." : "Bitte gib den gewünschten Songtitel für Spotify an.");
      return;
    }
    if (!formData.customerName.trim()) {
      alert(language === "en" ? "Please enter your name." : "Bitte gib deinen Namen an.");
      return;
    }
    if (!formData.customerEmail.trim()) {
      alert(language === "en" ? "Please enter your email address." : "Bitte gib deine E-Mail-Adresse an.");
      return;
    }
    if (!agreedTerms) {
      alert(language === "en" ? "Please confirm the terms and that work starts right away." : "Bitte bestätige die AGB und den Beginn der sofortigen Ausführung.");
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
          locale: language,
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
          successUrl: `${window.location.origin}${lp("/streaming")}?stripe_success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}${lp("/streaming")}?stripe_cancel=true`,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || (en ? "Error starting Stripe. Please check the configuration." : "Fehler beim Starten von Stripe. Bitte prüfe die Konfiguration."));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Stripe Error:", err);
      setErrorMessage(language === "en" ? "Connection error with Stripe. Please try again." : "Verbindungsfehler zu Stripe. Bitte erneut versuchen.");
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 selection:bg-amber-500 selection:text-white">
      <SchemaJsonLd type="streaming" />
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>{language === "en" ? "Back to home page" : "Zurück zur Startseite"}</span>
          </button>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 text-sm font-bold text-stone-900 hover:opacity-90 transition"
          >
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="hidden sm:inline">MyMusicMoment<span className="text-amber-500">24</span></span>
          </button>

          <div className="scale-90 sm:scale-100">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-b from-amber-50/70 via-stone-50 to-[#faf8f5] border-b border-stone-200/80 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>{language === "en" ? "Exclusive release service for customers" : "Exklusiver Release-Service für Kunden"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
            {language === "en" ? (
              <>Your personal song on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">Spotify, Apple Music & YouTube</span></>
            ) : (
              <>Dein persönlicher Song auf <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">Spotify, Apple Music & YouTube</span></>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-stone-600 font-normal max-w-2xl mx-auto leading-relaxed mb-8">
            {language === "en" 
              ? "Make your personal song streamable worldwide on all the major platforms. I take care of the whole release through the music distributor DistroKid under the artist profile 'MyMusicMoment24'. It stays online permanently for a one-time fee of €4.99."
              : "Mache deinen persönlichen Song weltweit auf allen großen Plattformen streambar! Ich übernehme die komplette Veröffentlichung über den Musikvertrieb DistroKid unter dem Künstlerprofil „MyMusicMoment24“ – dauerhaft online für einmalig nur 4,99 €."}
          </p>

          {/* Platform Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {platforms.map((p, idx) => (
              <span
                key={idx}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-sm bg-white ${p.color}`}
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
          <div className="bg-white border border-stone-200 hover:border-emerald-500/50 p-6 rounded-3xl transition-all shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-2">
              {language === "en" ? "Available worldwide" : "Weltweit verfügbar"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === "en"
                ? "Your song can be found on Spotify, Apple Music, YouTube Music, Deezer and in the Instagram/TikTok sound library."
                : "Dein Song wird suchbar auf Spotify, Apple Music, YouTube Music, Deezer und in der Instagram/TikTok-Sound-Bibliothek."}
            </p>
          </div>

          <div className="bg-white border border-stone-200 hover:border-amber-500/50 p-6 rounded-3xl transition-all shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
              <Disc className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-2">
              {language === "en" ? "Official artist profile" : "Offizielles Künstlerprofil"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === "en"
                ? "Released officially under the verified artist profile 'MyMusicMoment24', including professional cover artwork & ISRC codes."
                : "Erscheint offiziell unter dem verifizierten Künstlerprofil „MyMusicMoment24“ inklusive professionellem Cover-Artwork & ISRC-Codes."}
            </p>
          </div>

          <div className="bg-white border border-stone-200 hover:border-teal-500/50 p-6 rounded-3xl transition-all shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-2">
              {language === "en" ? "One-time €4.99 • No subscription" : "Einmalig 4,99 € • Kein Abo"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === "en"
                ? "A one-time fixed price with no ongoing costs. Your song stays online on the streaming services permanently."
                : "Einmaliger Festpreis ohne laufende Kosten. Dein Song bleibt dauerhaft auf den Streaming-Diensten online."}
            </p>
          </div>
        </div>

        {/* How It Works Process */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 mb-16 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3 inline-block">
              {language === "en" ? "How it works" : "So einfach funktioniert's"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {language === "en" ? "Released worldwide in 3 steps" : "In 3 Schritten zur weltweiten Veröffentlichung"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base mb-1">
                  {language === "en" ? "Details & booking (€4.99)" : "Angaben & Buchung (4,99 €)"}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === "en"
                    ? "Fill in the short form below with the song title you want and your email address."
                    : "Fülle unten das kurze Formular mit deinem Wunsch-Songtitel und deiner E-Mail-Adresse aus."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base mb-1">
                  {language === "en" ? "Artwork & DistroKid upload" : "Artwork & DistroKid-Upload"}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === "en"
                    ? "I create the cover artwork, check the audio metadata and submit the song through DistroKid."
                    : "Ich erstelle das Cover-Artwork, prüfe die Audio-Metadaten und übermittle den Song via DistroKid."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base mb-1">
                  {language === "en" ? "Live in about 3 to 7 days" : "Live in ca. 3 bis 7 Tagen"}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === "en"
                    ? "Once the platforms have approved the song, I'll email you your Spotify link."
                    : "Sobald die Plattformen den Song freigegeben haben, schicke ich dir deinen Spotify-Link per E-Mail."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* View A: Success / Confirmation Screen with DistroKid Copy Button */}
        {completedOrder ? (
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-lg animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
                {language === "en" ? "Payment of €4.99 successful" : "Zahlung über 4,99 € erfolgreich!"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                {language === "en" 
                  ? "I've received your streaming order. A confirmation is on its way to you by email." 
                  : "Ich habe deinen Streaming-Auftrag erhalten. Eine Bestätigung ist per E-Mail an dich unterwegs."}
              </p>
              <div className="mt-3 inline-block bg-stone-100 px-3 py-1 rounded-lg text-xs font-mono text-emerald-800 border border-stone-200">
                Tx-ID: {completedOrder.transactionId || "N/A"}
              </div>
            </div>

            {/* DistroKid Box with 1-Click Copy */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                    {en ? "DistroKid upload data" : "DistroKid Upload-Daten"}
                  </span>
                  <span className="text-xs text-stone-500">
                    {language === "en" ? "Ready to copy:" : "Sofort bereit zum Übertragen & Rauskopieren:"}
                  </span>
                </div>
                <button
                  onClick={handleCopyDistroKidData}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shrink-0 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === "en" ? "Copied to clipboard" : "In Zwischenablage kopiert! ✅"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{language === "en" ? "Copy DistroKid data" : "📋 DistroKid-Daten kopieren"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">{en ? "Artist name:" : "Artist Name (Künstler):"}</span>
                  <span className="font-bold text-stone-900 text-sm">MyMusicMoment24</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">{en ? "Song title (title on Spotify):" : "Song Title (Titel auf Spotify):"}</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {completedOrder.orderDetails?.songTitle || formData.songTitle || "Song"}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Primary Genre:</span>
                  <span className="font-semibold text-stone-800">
                    {completedOrder.orderDetails?.genre || formData.genre || "Pop"}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Language / Explicit:</span>
                  <span className="font-semibold text-stone-800">
                    {completedOrder.orderDetails?.language || formData.songLanguage} • {formData.explicitLyrics ? "Explicit" : "Clean"}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">{en ? "Customer / contact:" : "Kunde / Kontakt:"}</span>
                  <span className="font-semibold text-stone-800">
                    {completedOrder.customerName} ({completedOrder.customerEmail})
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">{en ? "Order reference:" : "Bestell-Referenz:"}</span>
                  <span className="font-semibold text-stone-800">
                    {completedOrder.orderDetails?.originalOrderNumber || formData.originalOrderNumber || (en ? "None" : "Keine")}
                  </span>
                </div>
              </div>

              {/* Monospace Raw Text Box */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 text-[11px] font-mono text-stone-800">
                <pre className="whitespace-pre-wrap leading-relaxed select-all">
                  {getDistroKidCopyText(completedOrder)}
                </pre>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 mb-6 text-xs text-stone-700 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {language === "en" ? "What happens now?" : "Wie geht es nun weiter?"}
              </h4>
              {en ? (
                <>
                  <p>1. 🎨 <strong>Cover artwork:</strong> I create the 3000x3000px cover image for your release.</p>
                  <p>2. 🚀 <strong>DistroKid upload:</strong> I upload the track and assign the ISRC codes.</p>
                  <p>3. ⏳ <strong>Availability:</strong> Depending on the distributor, your song goes live on Spotify, Apple Music & co. after 3 to 7 days.</p>
                  <p>4. 📩 <strong>Streaming link:</strong> I'll email you the Spotify link.</p>
                </>
              ) : (
                <>
                  <p>1. 🎨 <strong>Cover-Artwork:</strong> Ich erstelle das 3000x3000px Titelbild für deinen Release.</p>
                  <p>2. 🚀 <strong>DistroKid-Upload:</strong> Ich lade den Track hoch und vergebe die ISRC-Codes.</p>
                  <p>3. ⏳ <strong>Verfügbarkeit:</strong> Je nach Musikvertrieb ist dein Song nach 3 bis 7 Tagen auf Spotify, Apple Music & Co. live.</p>
                  <p>4. 📩 <strong>Streaming-Link:</strong> Ich schicke dir den Spotify-Link per E-Mail.</p>
                </>
              )}
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
                className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition text-center"
              >
                {language === "en" ? "Set up another release" : "Weiteren Release anlegen"}
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition text-center shadow-sm"
              >
                {language === "en" ? "Back to home page" : "Zurück zur Startseite"}
              </button>
            </div>
          </div>
        ) : (

          /* View B: The Booking Form with Integrated PayPal and Stripe Checkout */
          <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {language === "en" ? "DistroKid upload form" : "DistroKid Upload-Formular"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                {language === "en" ? "Get your song on Spotify & co." : "Jetzt Song auf Spotify & Co. bringen"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === "en"
                  ? "One-time fixed price of €4.99 • Official profile 'MyMusicMoment24' • Pay securely by PayPal or credit card"
                  : "Einmalig 4,99 € Festpreis • Offizielles Profil „MyMusicMoment24“ • Direkt sicher per PayPal oder Kreditkarte"}
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-5">
              
              {/* Section 1: Song & DistroKid Details */}
              <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5" />
                  <span>{en ? "1. Song & DistroKid details" : "1. Song & DistroKid-Angaben"}</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    {language === "en" ? "Song title on Spotify & Apple Music *" : "Wunsch-Songtitel auf Spotify & Apple Music *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={en ? "e.g. Forever Us (Lisa & Max)" : "z. B. Für immer wir (Lisa & Max)"}
                    value={formData.songTitle}
                    onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    {language === "en" 
                      ? "Will appear as: 'MyMusicMoment24 - [Your song title]'" 
                      : "Erscheint als: „MyMusicMoment24 – [Dein Songtitel]“"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Music style (genre) *" : "Musikrichtung (Genre) *"}
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {genres.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Language of the lyrics" : "Sprache der Lyrics"}
                    </label>
                    <select
                      value={formData.songLanguage}
                      onChange={(e) => setFormData({ ...formData, songLanguage: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Deutsch">{en ? "German" : "Deutsch"}</option>
                      <option value="Englisch">{en ? "English" : "Englisch"}</option>
                      <option value="Spanisch">{en ? "Spanish" : "Spanisch"}</option>
                      <option value="Italienisch">{en ? "Italian" : "Italienisch"}</option>
                      <option value="Sonstige">{en ? "Other" : "Sonstige"}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.explicitLyrics}
                      onChange={(e) => setFormData({ ...formData, explicitLyrics: e.target.checked })}
                      className="rounded bg-white border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                    />
                    <span>{language === "en" ? "Contains explicit language (swear words) [Explicit tag]" : "Enthält explizite Sprache (Schimpfwörter) [Explicit Tag]"}</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Customer Contact & Order Reference */}
              <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{en ? "2. Contact details & order reference" : "2. Kontaktdaten & Zuordnung"}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Your first & last name *" : "Dein Vor- & Nachname *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={en ? "John Smith" : "Max Mustermann"}
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Your email address *" : "Deine E-Mail-Adresse *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={en ? "your-email@example.com" : "deine-email@beispiel.de"}
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Phone / WhatsApp (optional)" : "Telefon / WhatsApp (optional)"}
                    </label>
                    <input
                      type="tel"
                      placeholder="+49 170 1234567"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      {language === "en" ? "Original order no. or song topic" : "Ursprungs-Bestell-Nr. oder Song-Thema"}
                    </label>
                    <input
                      type="text"
                      placeholder={en ? "e.g. wedding song Sarah & Tim" : "z. B. Hochzeitssong Sarah & Tim"}
                      value={formData.originalOrderNumber}
                      onChange={(e) => setFormData({ ...formData, originalOrderNumber: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    {language === "en" ? "Special notes / cover wishes (optional)" : "Besondere Notizen / Cover-Wünsche (optional)"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === "en" ? "e.g. a photo you'd like or a dedication for the cover..." : "z. B. Foto-Wunsch oder Widmung fürs Cover..."}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Section 3: Payment Method Selection & Checkout Directly on the Page */}
              <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{en ? "3. Choose a payment method (€4.99)" : "3. Zahlungsart wählen (4,99 €)"}</span>
                  </h4>
                  <span className="text-lg font-black text-stone-900">{en ? "€4.99" : "4,99 €"}</span>
                </div>

                {/* PayPal Express Option */}
                <label className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${paymentMethod === "paypal" ? "bg-amber-50/90 border-amber-400 text-stone-900 shadow-sm ring-2 ring-amber-400/40" : "bg-white border-stone-200 text-stone-800 hover:border-amber-300 hover:bg-amber-50/30"}`}>
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
                        <span className="font-extrabold text-stone-900 text-xs sm:text-sm">PayPal Express & SEPA</span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded border border-emerald-200">{en ? "No account needed" : "Ohne Konto möglich"}</span>
                      </div>
                      <span className="text-[11px] text-stone-600 block mt-0.5 font-medium">{en ? "With a PayPal account, or without one by SEPA direct debit / debit card" : "Mit PayPal-Konto oder ganz ohne Konto per SEPA-Bankeinzug / Debitkarte"}</span>
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
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === "stripe" ? "bg-emerald-50/90 border-emerald-500 text-stone-900 shadow-sm ring-2 ring-emerald-500/30" : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="text-emerald-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm block text-stone-900">{en ? "Credit card / Apple Pay / Klarna" : "Kreditkarte / Apple Pay / Klarna"}</span>
                      <span className="text-[11px] text-stone-500">{en ? "Pay directly with Stripe Checkout" : "Direkte Zahlung via Stripe Checkout"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 scale-90 sm:scale-100">
                    <StripeBadge className="h-4" />
                    <ApplePayBadge className="h-4" />
                  </div>
                </label>

                {/* Legal Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-600">
                    <input
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="rounded bg-white border-stone-300 text-emerald-600 mt-0.5 w-4 h-4 shrink-0 focus:ring-emerald-500"
                    />
                    <span>
                      {en
                        ? "I agree to the terms and conditions and the privacy policy. I request immediate release on the streaming platforms and acknowledge that my right of withdrawal expires for individually created digital content."
                        : "Ich stimme den Allgemeinen Geschäftsbedingungen (AGB) und der Datenschutzerklärung zu. Ich beauftrage die sofortige Veröffentlichung auf den Streaming-Plattformen und nehme zur Kenntnis, dass das Widerrufsrecht bei individueller digitaler Erstellung erlischt."}
                    </span>
                  </label>
                </div>

                {/* Validation Reminder */}
                {(!formData.songTitle || !formData.customerName || !formData.customerEmail || !agreedTerms) && (
                  <p className="text-[11px] text-amber-900 text-center py-2 px-3 bg-amber-50 rounded-xl border border-amber-200 font-medium">
                    💡 {en
                      ? "Please fill in the song title, name and email and tick the terms box to enable payment."
                      : "Bitte Songtitel, Name, E-Mail ausfüllen und das AGB-Kästchen abhaken, um die Zahlung zu aktivieren."}
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
                            createOrder={(data, actions) =>
                              createPayPalOrder(actions, streamingPayload(), {
                                description: `Spotify & Streaming Release: ${formData.songTitle}`,
                                fallbackAmount: PRICES.streaming,
                              })
                            }
                            onApprove={async (data, actions) => {
                              setIsProcessing(true);
                              try {
                                const txId = await capturePayPalOrder(data, actions, streamingPayload());
                                const orderData = { ...streamingPayload(), transactionId: txId, paymentProvider: "paypal", amount: PRICES.streaming.toFixed(2) };

                                setCompletedOrder(orderData);
                                trackPurchase(txId, {
                                  price: 4.99,
                                  name: orderData.orderName,
                                  id: "streaming-release",
                                });
                              } catch (err) {
                                console.error("PayPal Error:", err);
                                alert(en ? "PayPal payment error. Please try again." : "Zahlungsfehler bei PayPal. Bitte erneut versuchen.");
                              } finally {
                                setIsProcessing(false);
                              }
                            }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <p className="text-xs text-red-500 text-center">{en ? "PayPal client ID is not configured." : "PayPal Client ID nicht konfiguriert."}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStripeCheckout}
                      disabled={!formData.songTitle || !formData.customerName || !formData.customerEmail || !agreedTerms || isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>
                        {isProcessing ? (en ? "Connecting to Stripe..." : "Verbindung zu Stripe...") : (en ? "Pay with credit card / Apple Pay (€4.99)" : "Mit Kreditkarte / Apple Pay zahlen (4,99 €)")}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{en ? "Secure 256-bit SSL encryption • No subscriptions or hidden fees" : "Sichere 256-Bit SSL-Verschlüsselung • Keine Abos oder versteckte Gebühren"}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}