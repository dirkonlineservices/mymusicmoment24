import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, Music, Sparkles, Lock, Eye, CheckCircle2, HelpCircle, MessageCircle, Landmark, CreditCard, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { trackAddToCart, trackBeginCheckout, trackPurchase } from "../lib/gtmPreview";
import { PayPalBadge, StripeBadge, VisaBadge, ApplePayBadge, SepaBadge, DebitCardBadge } from "./PaymentBadges";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLanguage } from "../context/LanguageContext";
import { PRICES, orderKind, calculatePrice } from "../lib/pricing";
import { createPayPalOrder, capturePayPalOrder } from "../lib/paypalServer";

// Bank transfer configuration (Vorkasse)
export const BANK_DETAILS = {
  holder: "Dirk Schmetzer",
  bank: "ING DiBa",
  iban: import.meta.env.VITE_BANK_IBAN || "DE92 5001 0517 5431 9731 25",
  bic: "INGDDEFFXXX",
};

export default function PayPalCheckout({ isOpen, onClose, order }) {
  const { t, language, lp } = useLanguage();
  const en = language === "en";
  const money = (n) => (en ? `€${n.toFixed(2)}` : `${n.toFixed(2).replace(".", ",")} €`);
  // Platzhalter des Gutscheins ("Wahl beim Einlösen") in der Anzeige übersetzen
  const shownDetail = (v) => (en && v === "Wahl beim Einlösen" ? "Chosen when redeeming" : v);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [songDetailsText, setSongDetailsText] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const discountApplied = discountRate > 0;
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [includeCertificate, setIncludeCertificate] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPaymentHelp, setShowPaymentHelp] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const copyToClipboard = (text, field) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2500);
    }
  };

  useEffect(() => {
    if (isOpen && order) {
      trackAddToCart(order);
      trackBeginCheckout(order);
      setIsCompleted(false);
      setIncludeCertificate(Boolean(order?.details?.pdfLyrics));
      const initialDetails = [
        order?.details?.names ? `${language === "en" ? "Names" : "Namen"}: ${order.details.names}` : "",
        order?.details?.story ? order.details.story : "",
        order?.details?.notes ? order.details.notes : "",
      ]
        .filter(Boolean)
        .join("\n");
      setSongDetailsText(initialDetails);
    }
  }, [isOpen, order, language]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Code aus der Gutschein-Karte der Startseite automatisch übernehmen
  useEffect(() => {
    if (!isOpen) return;
    let stored = "";
    try { stored = sessionStorage.getItem("mmm24_promo_code") || ""; } catch {}
    if (!stored) return;
    setDiscountCode(stored);
    fetch("/api/validate-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: stored }),
    })
      .then((res) => res.json())
      .then(({ valid, rate }) => setDiscountRate(valid ? rate : 0))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const kind = orderKind({ category: order?.category, orderDetails: order?.details, id: order?.id });
  const isStreaming = kind === "streaming";
  // Anzeige; den verbindlichen Betrag berechnet der Server mit derselben Preisliste
  const currentPrice = calculatePrice({
    kind,
    express: Boolean(order.details?.express),
    certificate: includeCertificate,
    discountRate,
  });

  // Code beim Server prüfen; der Server liefert den Rabattsatz
  const applyDiscount = async (code, { silent = false } = {}) => {
    if (!String(code || "").trim()) return;
    try {
      const res = await fetch("/api/validate-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const { valid, rate } = await res.json();
      setDiscountRate(valid ? rate : 0);
      if (!silent) {
        alert(valid
          ? t("checkout.discountAppliedRate", "Rabattcode aktiviert: {n} % günstiger").replace("{n}", Math.round(rate * 100))
          : t("checkout.discountInvalid", "Ungültiger Rabattcode."));
      }
    } catch {
      if (!silent) alert(t("checkout.discountInvalid", "Ungültiger Rabattcode."));
    }
  };

  const handleApplyDiscount = () => applyDiscount(discountCode);

  // Bestelldaten für den Server (ohne Betrag – den berechnet der Server)
  const orderPayload = () => ({
    category: order.category,
    locale: language,
    customerEmail,
    customerName,
    customerPhone,
    songDetailsText,
    orderDetails: {
      ...order.details,
      pdfLyrics: includeCertificate,
    },
    orderName: order.name,
    discountCode: discountApplied ? discountCode : "",
  });

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  const recordOrder = async (txId, payerDetails = null) => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderPayload(),
          transactionId: txId,
          paymentProvider: paymentMethod,
          payer: payerDetails,
        }),
      });
    } catch (err) {
      console.error("Fehler beim Senden an /api/orders:", err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!customerEmail) {
      alert(language === "en" ? "Please enter your email address so I can deliver your song." : "Bitte gib deine E-Mail-Adresse für die Zustellung des Songs an.");
      return;
    }
    if (!agreedTerms) {
      alert(language === "en" ? "Please confirm the terms and that production starts right away." : "Bitte bestätige die Geschäftsbedingungen und den Beginn der sofortigen Produktion.");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "stripe") {
      try {
        const response = await fetch("/api/create-stripe-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderPayload(),
            successUrl: `${window.location.origin}${lp("/")}?session_id={CHECKOUT_SESSION_ID}&stripe_success=true`,
            cancelUrl: `${window.location.origin}${lp("/")}?stripe_cancel=true`,
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          alert(data.error || (en ? "Error starting Stripe Checkout. Please check the configuration." : "Fehler beim Starten von Stripe Checkout. Bitte prüfe die Konfiguration."));
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.error("Stripe Checkout Error:", err);
        alert(language === "en" ? "Connection error to Stripe. Please try again." : "Verbindungsfehler zu Stripe. Bitte versuche es erneut.");
        setIsProcessing(false);
        return;
      }
    }

    const generatedTxId = `MMM-${Date.now().toString(36).toUpperCase()}`;
    await recordOrder(generatedTxId);
    setTimeout(() => {
      setTransactionId(generatedTxId);
      setIsProcessing(false);
      setIsCompleted(true);
      trackPurchase(generatedTxId, { ...order, price: currentPrice });
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={en ? "Checkout" : "Kasse & Checkout"}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex items-stretch">
        {/* Bezahlhilfe Side Panel - DESKTOP: Appears to the LEFT of the main checkout form */}
        {showPaymentHelp && (
          <aside
            aria-label={en ? "Payment help & instructions" : "Bezahlhilfe & Anleitung"}
            className="hidden md:flex flex-col w-80 lg:w-96 bg-white/98 backdrop-blur-md border-l border-r border-stone-200 shadow-2xl p-5 sm:p-6 overflow-y-auto animate-in slide-in-from-right duration-300 z-10 justify-between text-stone-900"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold text-base">
                    💡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {language === "en" ? "Payment help & instructions" : "Bezahlhilfe & Anleitung"}
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      {language === "en" ? "Step by step to your song" : "Schritt für Schritt zum Wunschsong"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentHelp(false)}
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition"
                  aria-label={en ? "Close" : "Schließen"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                {/* Schritt 1: E-Mail & Häkchen */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[11px] text-amber-800">1</span>
                    <span>{language === "en" ? "Enter email & tick the box" : "E-Mail & Häkchen setzen"}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed pl-7">
                    {language === "en"
                      ? "Enter the email for your song delivery and tick the box for the terms. Only then do the payment buttons become active."
                      : "Trage deine E-Mail für die Song-Lieferung ein und setze das Häkchen bei den AGB. Erst danach schalten sich die Bezahl-Buttons aktiv frei!"}
                  </p>
                </div>

                {/* Schritt 2: PayPal ohne Konto / SEPA-Lastschrift */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[11px] text-amber-900">2</span>
                    <span>{language === "en" ? "PayPal or direct debit (SEPA)" : "PayPal oder Bankeinzug (SEPA)"}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 font-medium pl-7 leading-relaxed">
                    {language === "en"
                      ? "You do NOT need a PayPal account. You can simply pay by direct debit without signing up:"
                      : "Du brauchst KEIN PayPal-Konto! Du kannst ganz einfach ohne Registrierung per Bankeinzug zahlen:"}
                  </p>
                  <ol className="text-[11px] text-stone-600 pl-7 space-y-1 list-decimal list-inside">
                    <li>{language === "en" ? "Click the yellow PayPal button" : "Auf den gelben PayPal-Button klicken"}</li>
                    <li>{language === "en" ? "In the PayPal window, click 'Pay with Debit or Credit Card' or 'Pay as Guest'" : "Im PayPal-Fenster auf „Mit Debit- oder Kreditkarte zahlen“ bzw. „Als Gast zahlen“ klicken"}</li>
                    <li>{language === "en" ? "Enter your IBAN for direct debit or your card details" : "Deine IBAN für Lastschrift oder Kartendaten eingeben"}</li>
                    <li>{language === "en" ? "Confirm the payment. Done." : "Zahlung bestätigen – fertig!"}</li>
                  </ol>
                </div>

                {/* Schritt 3: Stripe Kreditkarte / Apple Pay */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[11px] text-stone-700">3</span>
                    <span>{language === "en" ? "Credit card, Apple Pay & Google Pay" : "Kreditkarte, Apple Pay & Google Pay"}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed pl-7">
                    {language === "en"
                      ? "Choose 'Credit card & Pay' to pay directly with Visa, Mastercard, Apple Pay or Google Pay."
                      : "Wähle 'Kreditkarte & Pay', um direkt per Visa, Mastercard, Apple Pay oder Google Pay zu bezahlen."}
                  </p>
                </div>

                {/* Schritt 4: Banküberweisung (Vorkasse) */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span>{language === "en" ? "Regular bank transfer" : "Klassische Banküberweisung"}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                    {language === "en"
                      ? "Choose 'Bank transfer' at checkout and order right away. You'll get your personal order number and my IBAN immediately. Important: production of your song starts as soon as the money arrives in my account (usually 1 business day)."
                      : "Wähle 'Banküberweisung' im Kassenfenster und bestelle direkt. Du erhältst sofort deine persönliche Bestellnummer und meine IBAN. Wichtig: Die Produktion deines Liedes beginnt sofort nach Geldeingang auf meinem Konto (in der Regel 1 Werktag)."}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="pt-4 border-t border-stone-200 mt-4 space-y-2">
              <a
                href={en ? "https://wa.me/4915906122744?text=Hi%20Dirk,%20I%20need%20help%20with%20the%20payment" : "https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20brauche%20Hilfe%20bei%20der%20Bezahlung"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === "en" ? "WhatsApp help directly from Dirk" : "WhatsApp Direkthilfe mit Dirk"}</span>
              </a>
              <div className="text-center">
                <a
                  href={lp("/support")}
                  className="text-[11px] text-stone-500 hover:text-amber-600 underline transition inline-flex items-center gap-1"
                >
                  <span>{language === "en" ? "Go to the full support page" : "Zur ausführlichen Support-Seite"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>
        )}

        <div className="w-screen max-w-lg bg-white border-l border-stone-200 shadow-2xl p-5 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 text-stone-900">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo-icon.png"
                  alt="MyMusicMoment24 Logo"
                  className="w-9 h-9 object-contain"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900">{t("checkout.step")}</h3>
                  <p className="text-[11px] text-stone-500">MyMusicMoment24 • {language === "en" ? "Immediate production" : "Sofortige Produktion"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-lg transition hover:bg-stone-100"
                aria-label={t("checkout.closeBtn")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCompleted ? (
              <div className="my-6 space-y-4">
                {paymentMethod === "bank_transfer" ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-stone-900">
                        {language === "en" ? "Order placed successfully" : "Bestellung erfolgreich aufgegeben!"}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                        {language === "en"
                          ? "Thank you for your order. Please transfer the amount now and use your order number as the payment reference."
                          : "Vielen Dank für deine Bestellung! Bitte überweise den Betrag nun unter Angabe deiner Bestellnummer als Verwendungszweck."}
                      </p>
                    </div>

                    {/* Bank Details Card with Copy Buttons */}
                    <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-lg space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
                        <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{language === "en" ? "Bank transfer details (prepayment):" : "Überweisungsdaten (Vorkasse):"}</span>
                        </span>
                        <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          {language === "en" ? "Prepayment" : "Vorkasse"}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Verwendungszweck / Order-ID */}
                        <div className="p-3 bg-amber-100/70 border-2 border-amber-400 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black text-amber-900 uppercase block tracking-wider">
                              {language === "en" ? "Payment reference (important):" : "Verwendungszweck (Wichtig!):"}
                            </span>
                            <span className="text-sm sm:text-base font-mono font-black text-stone-900 tracking-wider truncate block">
                              {transactionId}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(transactionId, "txId")}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1 shrink-0 shadow-sm active:scale-95"
                          >
                            {copiedField === "txId" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === "txId" ? (en ? "Copied" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                          </button>
                        </div>

                        {/* Amount */}
                        <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block">{language === "en" ? "Amount to transfer:" : "Zu überweisender Betrag:"}</span>
                            <span className="text-sm font-black text-emerald-700">{money(currentPrice)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(money(currentPrice), "amount")}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1 shrink-0"
                          >
                            {copiedField === "amount" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedField === "amount" ? (en ? "Copied" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                          </button>
                        </div>

                        {/* Account Holder */}
                        <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] text-stone-500 block">{language === "en" ? "Recipient / account holder:" : "Empfänger / Kontoinhaber:"}</span>
                            <span className="text-xs font-bold text-stone-900 truncate block">{BANK_DETAILS.holder}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_DETAILS.holder, "holder")}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1 shrink-0"
                          >
                            {copiedField === "holder" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedField === "holder" ? (en ? "Copied" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                          </button>
                        </div>

                        {/* IBAN */}
                        <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] text-stone-500 block">IBAN:</span>
                            <span className="text-xs font-mono font-black text-amber-700 tracking-wider truncate block">
                              {BANK_DETAILS.iban}
                            </span>
                          </div>
                          {BANK_DETAILS.iban && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(BANK_DETAILS.iban, "iban")}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1 shrink-0"
                            >
                              {copiedField === "iban" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === "iban" ? (en ? "Copied" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                            </button>
                          )}
                        </div>

                        {/* BIC */}
                        {BANK_DETAILS.bic && (
                          <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-stone-500 block">BIC / Bank:</span>
                              <span className="text-xs font-mono font-bold text-stone-900">{BANK_DETAILS.bic} ({BANK_DETAILS.bank})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(BANK_DETAILS.bic, "bic")}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1 shrink-0"
                            >
                              {copiedField === "bic" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === "bic" ? (en ? "Copied" : "Kopiert!") : (en ? "Copy" : "Kopieren")}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Important production start notice */}
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1">
                        <span className="font-black text-amber-900 block flex items-center gap-1.5">
                          <span>⏳</span>
                          <span>{language === "en" ? "Important note on production:" : "Wichtiger Produktionshinweis:"}</span>
                        </span>
                        <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
                          {language === "en"
                            ? `I start creating your personal song as soon as your payment arrives in my account (usually 1 business day). Once it has arrived, you'll get a confirmation at ${customerEmail}.`
                            : `Die Erstellung deines persönlichen Songs beginnt sofort nach Geldeingang auf meinem Konto (in der Regel 1 Werktag). Du erhältst nach Eingang eine Bestätigung an ${customerEmail}.`}
                        </p>
                      </div>

                      <div className="pt-2 text-center">
                        <a
                          href={en ? `https://wa.me/4915906122744?text=Hi%20Dirk,%20I%20just%20ordered%20by%20bank%20transfer%20(order%20number:%20${transactionId})` : `https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20habe%20gerade%20per%20Bank%C3%BCberweisung%20bestellt%20(Bestellnummer:%20${transactionId})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{language === "en" ? "Let Dirk know on WhatsApp" : "Dirk kurz per WhatsApp Bescheid geben"}</span>
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition text-sm shadow-md"
                    >
                      {language === "en" ? "Back to the shop" : "Zurück zum Shop"}
                    </button>
                  </div>
                ) : (
                  /* Standard Confirmation for PayPal / Stripe */
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-stone-900">{t("checkout.successTitle")}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {t("checkout.successDesc")}
                    </p>
                    <div className="bg-stone-50 p-4 rounded-xl text-left text-xs font-mono text-stone-700 space-y-1.5 border border-stone-200">
                      <div>{t("checkout.orderNumber")}: <span className="text-amber-700 font-bold">{transactionId}</span></div>
                      <div>{language === "en" ? "Recipient" : "Empfänger"}: <span className="text-stone-900">{customerEmail}</span></div>
                      <div>{language === "en" ? "Delivery via" : "Zustellung via"}: <span className="text-emerald-700 font-bold">{en ? "Email" : "E-Mail"} {customerPhone ? `& WhatsApp (${customerPhone})` : ""}</span></div>
                      <div>{language === "en" ? "Total" : "Gesamtbetrag"}: <span className="text-stone-900 font-bold">{money(currentPrice)}</span></div>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition text-sm shadow-md"
                    >
                      {language === "en" ? "Back to the shop" : "Zurück zum Shop"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                
                {/* Order Summary Box */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">{order.name}</h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {order.details?.genre ? `${shownDetail(order.details.genre)} • ${shownDetail(order.details.voice)}` : t("footer.stickyTitle")}
                      </p>
                    </div>
                    <span className="text-sm font-black text-amber-700 shrink-0">
                      {money(PRICES[kind])}
                    </span>
                  </div>

                  {order.details?.express && (
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>{t("configurator.summary.expressTitle")}</span>
                      <span className="font-semibold text-amber-700">{en ? "+€9.99" : "+9,99 €"}</span>
                    </div>
                  )}

                  {includeCertificate && (
                    <div className="flex justify-between text-xs text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <span>📜</span>
                        <span>{t("checkout.certificateLineItem", "Offizielle Song-Urkunde mit QR-Code")}</span>
                      </span>
                      <span className="font-semibold text-amber-700">{en ? "+€9.99" : "+9,99 €"}</span>
                    </div>
                  )}

                  {discountApplied && (
                    <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                      <span>{t("checkout.discountAppliedRate", "Rabattcode aktiviert: {n} % günstiger").replace("{n}", Math.round(discountRate * 100))}</span>
                      <span>-{Math.round(discountRate * 100)} %</span>
                    </div>
                  )}

                  {/* Discount Code Input */}
                  <div className="pt-1.5 flex gap-2">
                    <input
                      type="text"
                      placeholder={t("checkout.discountCodeLabel")}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition"
                    >
                      {t("checkout.discountApplyBtn")}
                    </button>
                  </div>

                  {/* Urkunde Add-on Checkbox (for songs & vouchers) */}
                  {!isStreaming && (
                    <div className="pt-2">
                      <div
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                          includeCertificate
                            ? "bg-amber-100/70 border-amber-400 shadow-sm"
                            : "bg-white border-stone-200 hover:border-amber-400"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={includeCertificate}
                              onChange={(e) => setIncludeCertificate(e.target.checked)}
                              className="rounded bg-white border-stone-300 text-amber-600 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                  {t("checkout.certificateAddonTitle", "Offizielle Song-Urkunde (+9,99 €)")}
                                </span>
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold rounded">
                                  {t("checkout.certificateAddonBadge", "Top-Geschenk")}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                                {t("checkout.certificateAddonDesc", "Druckfertiges DIN A4 PDF mit persönlichem Liedtext, goldenem Siegel & abspielbarem QR-Code zum Einrahmen.")}
                              </p>
                            </div>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCertificateModal(true)}
                            className="shrink-0 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t("checkout.certificatePreviewBtn", "Vorschau")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-xs sm:text-sm font-bold text-stone-900">
                    <span>{t("configurator.summary.totalPrice")}</span>
                    <span className="text-lg sm:text-xl font-black text-amber-700">
                      {money(currentPrice)}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handlePayment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t("checkout.emailLabel")}:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t("checkout.emailPlaceholder")}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {t("checkout.nameLabel")}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("checkout.namePlaceholder")}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {t("checkout.phoneLabel")}:
                      </label>
                      <input
                        type="tel"
                        placeholder="+49 170 1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t("checkout.detailsLabel")}:
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t("checkout.detailsPlaceholder")}
                      value={songDetailsText}
                      onChange={(e) => setSongDetailsText(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>

                  {/* Payment Method Selector - Organized in 2 rows */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        {t("checkout.paymentMethodTitle")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPaymentHelp(!showPaymentHelp)}
                        className="text-[11px] text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 transition shadow-sm"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>{showPaymentHelp ? (language === "en" ? "Close help" : "Hilfe schließen") : (language === "en" ? "💡 Payment help" : "💡 Bezahlhilfe & Anleitung")}</span>
                      </button>
                    </div>

                    {/* Row 1: PayPal Express & SEPA-Lastschrift */}
                    <label className={`relative block p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                      paymentMethod === "paypal"
                        ? "bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/40 text-stone-900"
                        : "bg-white border-stone-300 hover:border-amber-400 hover:bg-amber-50/40 text-stone-900"
                    }`}>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "paypal"}
                            onChange={() => setPaymentMethod("paypal")}
                            className="text-amber-600 w-4 h-4 mt-0.5 shrink-0 focus:ring-amber-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="font-extrabold text-stone-900 text-xs sm:text-sm">
                                {t("checkout.paypalTitle", "PayPal Express & SEPA-Lastschrift")}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black rounded-md shadow-sm">
                                {t("checkout.paypalBadge", "Ohne PayPal-Konto möglich")}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 font-medium mt-1 leading-relaxed">
                              {t("checkout.paypalDesc", "Mit PayPal-Konto oder ganz ohne Konto per SEPA-Lastschrift (Bankeinzug) / Debitkarte zahlen.")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-1">
                            <PayPalBadge className="h-4" />
                            <SepaBadge className="h-4" />
                          </div>
                          <DebitCardBadge className="h-3.5" />
                        </div>
                      </div>
                    </label>

                    {/* Row 2: Two Compact Columns - Stripe & Banküberweisung */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Option 2A: Stripe (Kreditkarte / Apple Pay / Klarna) */}
                      <label className={`relative block p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === "stripe"
                          ? "bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/40 text-stone-900"
                          : "bg-white border-stone-300 hover:border-amber-400 hover:bg-stone-50 text-stone-700"
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")}
                            className="text-amber-600 w-4 h-4 mt-0.5 shrink-0 focus:ring-amber-500 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-stone-900 text-xs block truncate">
                              {t("checkout.stripeTitle", "Kreditkarte & Pay")}
                            </span>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-snug truncate">
                              Apple Pay, Google Pay, Visa
                            </p>
                            <div className="flex items-center gap-1 pt-1.5 flex-wrap">
                              <StripeBadge className="h-3" />
                              <VisaBadge className="h-2.5" />
                              <ApplePayBadge className="h-3" />
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Option 2B: Banküberweisung (Vorkasse) */}
                      <label className={`relative block p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === "bank_transfer"
                          ? "bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-400/40 text-stone-900"
                          : "bg-white border-stone-300 hover:border-emerald-400 hover:bg-stone-50 text-stone-700"
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={() => setPaymentMethod("bank_transfer")}
                            className="text-emerald-600 w-4 h-4 mt-0.5 shrink-0 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-stone-900 text-xs block">
                                {t("checkout.bankTransferTitle", "Banküberweisung")}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                              {language === "en" ? "Prepayment to my IBAN" : "Vorkasse per IBAN"}
                            </p>
                            <div className="flex items-center gap-1.5 pt-1.5">
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-bold rounded flex items-center gap-1">
                                <Landmark className="w-2.5 h-2.5" />
                                <span>{en ? "IBAN & payment reference" : "IBAN & Verwendungszweck"}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>

                    </div>

                    {/* Mobile Bezahlhilfe Accordion (shown only on mobile < md when showPaymentHelp is open) */}
                    {showPaymentHelp && (
                      <div className="md:hidden mt-2 p-3.5 bg-stone-50 rounded-2xl border border-amber-300 shadow-md space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span>💡</span>
                            <span>{language === "en" ? "Payment help & instructions" : "Bezahlhilfe & Anleitung"}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPaymentHelp(false)}
                            className="text-stone-400 hover:text-stone-700 text-[11px]"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 text-[11px] text-stone-700">
                          <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                            <span className="font-bold text-amber-800">{en ? "1. Email & checkbox: " : "1. E-Mail & Häkchen: "}</span>
                            <span>{en ? "Enter your email & tick the terms box. Only then do the payment buttons become active." : "E-Mail eingeben & AGB abhaken – erst dann werden die Bezahl-Buttons aktiv!"}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                            <span className="font-bold text-amber-800">{en ? "2. PayPal without an account (direct debit): " : "2. PayPal ohne Konto (Bankeinzug): "}</span>
                            <span>{en ? "Click PayPal -> choose 'Pay as Guest' or 'Pay with Card' -> enter your IBAN -> done." : "PayPal anklicken -> „Als Gast zahlen“ oder „Mit Karte zahlen“ wählen -> IBAN eingeben -> Fertig!"}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                            <span className="font-bold text-stone-900">{en ? "3. Bank transfer (prepayment): " : "3. Überweisung (Vorkasse): "}</span>
                            <span>{en ? "Place your order, then transfer the amount to my IBAN with your order number. Production starts as soon as the money arrives." : "Bestellung aufgeben, per IBAN & Bestellnummer überweisen. Produktion startet sofort nach Geldeingang!"}</span>
                          </div>
                        </div>
                        <a
                          href={en ? "https://wa.me/4915906122744?text=Hi%20Dirk,%20I%20need%20help%20with%20the%20payment" : "https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20brauche%20Hilfe%20bei%20der%20Bezahlung"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{en ? "WhatsApp help directly from Dirk" : "WhatsApp Direkthilfe mit Dirk"}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Legal Checkbox */}
                  <div className="pt-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] sm:text-xs text-stone-700 p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="rounded bg-white border-stone-300 text-amber-600 mt-0.5 w-4 h-4 shrink-0 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="leading-snug">
                        {t("checkout.termsText")}
                      </span>
                    </label>
                  </div>

                  {/* Option 1: PayPal Smart Buttons */}
                  {paypalClientId && paymentMethod === "paypal" && (
                    <div className="pt-2">
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-400 shadow-md space-y-3.5">
                        
                        {/* Highlighted bar for PayPal, SEPA & Debitkarte */}
                        <div className="bg-white border border-amber-300 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                              <span className="text-amber-600 text-sm">✓</span>
                              <span>{language === "en" ? "Payment methods included:" : "Enthaltene Zahlungsarten:"}</span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shadow-sm">
                              {language === "en" ? "No PayPal account needed" : "Kein PayPal-Konto nötig"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <PayPalBadge />
                            <SepaBadge />
                            <DebitCardBadge />
                          </div>

                          <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                            {language === "en"
                              ? "With your PayPal account, OR simply choose 'Pay with Debit or Credit Card' / 'As Guest' below to pay easily by direct debit (SEPA)."
                              : "Mit deinem PayPal-Konto ODER wähle unten einfach „Mit Debit- oder Kreditkarte zahlen“ / „Als Gast“, um bequem per Bankeinzug (SEPA) zu bezahlen."}
                          </p>
                        </div>

                        {/* Inactive notice if not checked */}
                        {(!customerEmail || !agreedTerms) && (
                          <div className="text-xs text-amber-950 font-black text-center py-3 px-3.5 rounded-xl bg-amber-200 border-2 border-amber-300 shadow-sm animate-pulse">
                            {language === "en"
                              ? "👉 Please enter your email above & tick the box to unlock PayPal, SEPA & debit card."
                              : "👉 Bitte oben E-Mail eintragen & Häkchen setzen, um PayPal, SEPA & Debitkarte freizuschalten!"}
                          </div>
                        )}

                        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                          <PayPalButtons
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                            disabled={!customerEmail || !agreedTerms || isProcessing}
                            createOrder={(data, actions) =>
                              createPayPalOrder(actions, orderPayload(), {
                                description: order.name,
                                fallbackAmount: currentPrice,
                              })
                            }
                            onApprove={async (data, actions) => {
                              setIsProcessing(true);
                              try {
                                const txId = await capturePayPalOrder(data, actions, orderPayload());
                                setTransactionId(txId);
                                setIsProcessing(false);
                                setIsCompleted(true);
                                trackPurchase(txId, { ...order, price: currentPrice });
                              } catch (err) {
                                console.error("PayPal Capture Error:", err);
                                alert(language === "en" ? "Error while processing the payment. Please try again." : "Fehler bei der Zahlungsabwicklung. Bitte versuche es erneut.");
                                setIsProcessing(false);
                              }
                            }}
                            onError={(err) => {
                              console.error("PayPal Error:", err);
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Banküberweisung Instruction Box */}
                  {paymentMethod === "bank_transfer" && (
                    <div className="pt-2">
                      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-400 shadow-md space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                          <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                            <Landmark className="w-4 h-4 text-emerald-600" />
                            <span>{language === "en" ? "How the bank transfer works:" : "Ablauf der Banküberweisung:"}</span>
                          </span>
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            {language === "en" ? "Prepayment to my IBAN" : "Vorkasse per IBAN"}
                          </span>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-xl p-3.5 text-xs text-stone-700 space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">1</span>
                            <p className="leading-relaxed">
                              {en ? (
                                <>Click <strong>"Place order"</strong> below. You'll get your personal <strong>order number</strong> right away.</>
                              ) : (
                                <>Klicke unten auf <strong>„Bestellung jetzt aufgeben“</strong>. Du erhältst sofort deine persönliche <strong>Bestellnummer</strong>.</>
                              )}
                            </p>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">2</span>
                            <p className="leading-relaxed">
                              {en ? (
                                <>Transfer <strong>{money(currentPrice)}</strong> to my IBAN and use your <strong>order number as the payment reference</strong>.</>
                              ) : (
                                <>Überweise den Betrag von <strong>{money(currentPrice)}</strong> unter Angabe deiner <strong>Bestellnummer als Verwendungszweck</strong> auf meine IBAN.</>
                              )}
                            </p>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">3</span>
                            <p className="leading-relaxed text-amber-900 font-medium">
                              {en ? (
                                <><strong>Important:</strong> Production of your song starts as soon as the money arrives in my account (usually 1 business day).</>
                              ) : (
                                <><strong>Wichtig:</strong> Die Produktion deines Liedes beginnt sofort nach Geldeingang auf meinem Konto (in der Regel 1 Werktag).</>
                              )}
                            </p>
                          </div>
                        </div>

                        {(!customerEmail || !agreedTerms) && (
                          <div className="text-xs text-amber-950 font-black text-center py-3 px-3.5 rounded-xl bg-amber-200 border-2 border-amber-300 shadow-sm animate-pulse">
                            {language === "en"
                              ? "👉 Please enter your email above & tick the box to place your order."
                              : "👉 Bitte oben E-Mail eintragen & Häkchen setzen, um die Bestellung aufzugeben!"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Standard Submit Button for Bank Transfer & Stripe */}
                  {paymentMethod !== "paypal" && (
                    <button
                      type="submit"
                      disabled={isProcessing || !customerEmail || !agreedTerms}
                      className={`w-full py-3.5 sm:py-4 font-black text-sm sm:text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2 ${
                        !customerEmail || !agreedTerms
                          ? "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
                          : paymentMethod === "bank_transfer"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-emerald-500/25 active:scale-[0.99]"
                            : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/25 active:scale-[0.99]"
                      }`}
                    >
                      {isProcessing ? (
                        <span>{t("checkout.processing")} ⏳</span>
                      ) : paymentMethod === "bank_transfer" ? (
                        <span>{language === "en" ? "Place order (bank transfer)" : "Bestellung jetzt aufgeben (Überweisung)"} ({money(currentPrice)})</span>
                      ) : (
                        <span>{language === "en" ? "Order now with obligation to pay" : "Jetzt zahlungspflichtig bestellen"} ({money(currentPrice)})</span>
                      )}
                    </button>
                  )}
                </form>

                {/* Trust Badges */}
                <div className="pt-3.5 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("checkout.secureSsl")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t("hero.trustDelivery")}</span>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <PayPalBadge />
                    <SepaBadge />
                    <DebitCardBadge />
                    <StripeBadge />
                    <VisaBadge />
                    <MastercardBadge />
                    <ApplePayBadge />
                    <GooglePayBadge />
                    <KlarnaBadge />
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="pt-4 text-center text-[11px] text-stone-400">
            MyMusicMoment24 • {language === "en" ? "From the heart, for your ears" : "Von Herzen für die Ohren"}
          </div>

        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto text-stone-900"
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition"
              aria-label={en ? "Close" : "Schließen"}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "en" ? "Official song add-on" : "Offizielles Song-Zusatzprodukt"}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                {language === "en" ? "Official song certificate with lyrics & QR code" : "Offizielle Song-Urkunde mit Liedtext & QR-Code"}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                {language === "en"
                  ? "Print-ready A4 PDF with your personal lyrics, a golden seal & a playable QR code, ready to frame."
                  : "Druckfertiges DIN A4 PDF mit persönlichem Liedtext, goldenem Siegel & abspielbarem QR-Code zum Einrahmen."}
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-amber-300 shadow-md mb-4 bg-stone-50">
              <img
                src="/images/urkunde-beispiel.jpg"
                alt={en ? "Song certificate sample" : "Song-Urkunde Muster"}
                className="w-full h-auto object-contain max-h-[44vh] mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-700 mb-5 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "en" ? "Print-ready A4" : "Druckfertig DIN A4"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "en" ? "QR code: listen & download" : "QR-Code: Anhören & Download"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "en" ? "Golden seal" : "Goldenes Siegel"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                {language === "en" ? "Close" : "Schließen"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIncludeCertificate(true);
                  setShowCertificateModal(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === "en" ? "Add certificate (+€9.99)" : "Urkunde hinzufügen (+9,99 €)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
