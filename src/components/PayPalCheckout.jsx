import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, Music, Sparkles, Lock, Eye, CheckCircle2, HelpCircle, MessageCircle, Landmark, CreditCard, ChevronRight, ExternalLink } from "lucide-react";
import { trackAddToCart, trackBeginCheckout, trackPurchase } from "../lib/gtmPreview";
import { PayPalBadge, StripeBadge, VisaBadge, MastercardBadge, ApplePayBadge, GooglePayBadge, SepaBadge, KlarnaBadge, DebitCardBadge } from "./PaymentBadges";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLanguage } from "../context/LanguageContext";

export default function PayPalCheckout({ isOpen, onClose, order }) {
  const { t, language } = useLanguage();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [songDetailsText, setSongDetailsText] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [includeCertificate, setIncludeCertificate] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPaymentHelp, setShowPaymentHelp] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      trackAddToCart(order);
      trackBeginCheckout(order);
      setIsCompleted(false);
      setIncludeCertificate(Boolean(order?.details?.pdfLyrics));
    }
  }, [isOpen, order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const isStreaming = order?.category === "streaming" || order?.id?.includes("streaming");
  const isVoucher = order?.category === "gutschein" || order?.id?.includes("gutschein");
  const basePrice = (isStreaming || isVoucher) ? order.price : 19.99;
  const expressExtra = order.details?.express ? 9.99 : 0;
  const certificateExtra = (!isStreaming && includeCertificate) ? 9.99 : 0;
  const rawSubtotal = Number((basePrice + expressExtra + certificateExtra).toFixed(2));
  const currentPrice = discountApplied ? Number((rawSubtotal * 0.9).toFixed(2)) : rawSubtotal;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toLowerCase() === "gutschein" || discountCode.trim().toLowerCase() === "music10") {
      setDiscountApplied(true);
      alert(t("checkout.discountApplied", "10% Rabattcode erfolgreich aktiviert!"));
    } else if (discountCode.trim()) {
      alert(t("checkout.discountInvalid", "Ungültiger Rabattcode."));
    }
  };

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  const recordOrder = async (txId, payerDetails = null) => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txId,
          paymentProvider: paymentMethod,
          amount: currentPrice,
          customerEmail,
          customerName,
          customerPhone,
          songDetailsText,
          orderDetails: {
            ...order.details,
            pdfLyrics: includeCertificate,
          },
          orderName: order.name,
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
      alert(language === "en" ? "Please enter your email address for song delivery." : "Bitte gib deine E-Mail-Adresse für die Zustellung des Songs an.");
      return;
    }
    if (!agreedTerms) {
      alert(language === "en" ? "Please accept the terms and conditions and start of production." : "Bitte bestätige die Geschäftsbedingungen und den Beginn der sofortigen Produktion.");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "stripe") {
      try {
        const response = await fetch("/api/create-stripe-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: currentPrice,
            customerEmail,
            customerName,
            customerPhone,
            songDetailsText,
            orderDetails: {
              ...order.details,
              pdfLyrics: includeCertificate,
            },
            orderName: order.name,
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          alert(data.error || "Fehler beim Starten von Stripe Checkout. Bitte prüfe die Konfiguration.");
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
      aria-label="Kasse & Checkout"
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
            aria-label="Bezahlhilfe & Anleitung"
            className="hidden md:flex flex-col w-80 lg:w-96 bg-slate-950/98 backdrop-blur-md border-l border-r border-slate-800 shadow-2xl p-5 sm:p-6 overflow-y-auto animate-in slide-in-from-right duration-300 z-10 justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-base">
                    💡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {language === "en" ? "Payment Guide & Help" : "Bezahlhilfe & Anleitung"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === "en" ? "Step by step to your song" : "Schritt für Schritt zum Wunschsong"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentHelp(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                {/* Schritt 1: E-Mail & Häkchen */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">1</span>
                    <span>{language === "en" ? "Email & Consent Required" : "E-Mail & Häkchen setzen"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                    {language === "en"
                      ? "Enter your delivery email and check the consent box (waiver of statutory withdrawal for custom songs). The payment buttons will activate immediately!"
                      : "Trage deine E-Mail für die Song-Lieferung ein und setze das Häkchen bei den AGB. Erst danach schalten sich die Bezahl-Buttons aktiv frei!"}
                  </p>
                </div>

                {/* Schritt 2: PayPal ohne Konto / SEPA-Lastschrift */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-[11px]">2</span>
                    <span>{language === "en" ? "PayPal or SEPA Direct Debit" : "PayPal oder Bankeinzug (SEPA)"}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-medium pl-7 leading-relaxed">
                    {language === "en"
                      ? "No PayPal account needed! You can easily pay as a guest via SEPA bank debit:"
                      : "Du brauchst KEIN PayPal-Konto! Du kannst ganz einfach ohne Registrierung per Bankeinzug zahlen:"}
                  </p>
                  <ol className="text-[11px] text-slate-300 pl-7 space-y-1 list-decimal list-inside">
                    <li>{language === "en" ? "Click the yellow PayPal button" : "Auf den gelben PayPal-Button klicken"}</li>
                    <li>{language === "en" ? "Select 'Pay with Debit or Credit Card' / 'Pay as Guest'" : "Im PayPal-Fenster auf „Mit Debit- oder Kreditkarte zahlen“ bzw. „Als Gast zahlen“ klicken"}</li>
                    <li>{language === "en" ? "Enter your IBAN for direct debit" : "Deine IBAN für Lastschrift oder Kartendaten eingeben"}</li>
                    <li>{language === "en" ? "Confirm payment – finished!" : "Zahlung bestätigen – fertig!"}</li>
                  </ol>
                </div>

                {/* Schritt 3: Stripe Kreditkarte / Apple Pay */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">3</span>
                    <span>{language === "en" ? "Credit Card, Apple Pay, Klarna" : "Kreditkarte, Apple Pay, Klarna"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                    {language === "en"
                      ? "Choose 'Credit Card & Online Payment' to check out via Stripe with Visa, Mastercard, Apple Pay, Google Pay or Klarna."
                      : "Wähle 'Kreditkarte & Online-Zahlung', um direkt per Visa, Mastercard, Apple Pay, Google Pay oder Klarna zu bezahlen."}
                  </p>
                </div>

                {/* Schritt 4: Banküberweisung (Vorkasse) */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Landmark className="w-4 h-4 text-emerald-400" />
                    <span>{language === "en" ? "Bank Transfer (Advance Payment)" : "Klassische Banküberweisung"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                    {language === "en"
                      ? "Prefer direct bank transfer? Contact us for our IBAN. Important: Song production starts immediately upon payment receipt on our bank account (usually 1 business day)."
                      : "Möchtest du per normaler Überweisung zahlen? Kontaktiere uns kurz für unsere IBAN. Wichtig: Die Produktion deines Liedes beginnt sofort nach Geldeingang auf unserem Bankkonto (in der Regel 1 Werktag)."}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
              <a
                href="https://wa.me/491708285513?text=Hallo%20Dirk,%20ich%20brauche%20Hilfe%20bei%20der%20Bezahlung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === "en" ? "WhatsApp Direct Support" : "WhatsApp Direkthilfe mit Dirk"}</span>
              </a>
              <div className="text-center">
                <a
                  href="/support"
                  className="text-[11px] text-slate-400 hover:text-amber-400 underline transition inline-flex items-center gap-1"
                >
                  <span>{language === "en" ? "Open full Support & Help Page" : "Zur ausführlichen Support-Seite"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>
        )}

        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl p-5 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo-icon.png"
                  alt="MyMusicMoment24 Logo"
                  className="w-9 h-9 object-contain"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">{t("checkout.step")}</h3>
                  <p className="text-[11px] text-slate-400">MyMusicMoment24 • {language === "en" ? "Immediate Production" : "Sofortige Produktion"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition"
                aria-label={t("checkout.closeBtn")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCompleted ? (
              <div className="my-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">{t("checkout.successTitle")}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("checkout.successDesc")}
                </p>
                <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono text-slate-300 space-y-1.5 border border-slate-800">
                  <div>{t("checkout.orderNumber")}: <span className="text-amber-400 font-bold">{transactionId}</span></div>
                  <div>{language === "en" ? "Recipient" : "Empfänger"}: <span className="text-white">{customerEmail}</span></div>
                  <div>{language === "en" ? "Delivery via" : "Zustellung via"}: <span className="text-emerald-400 font-bold">E-Mail {customerPhone ? `& WhatsApp (${customerPhone})` : ""}</span></div>
                  <div>{language === "en" ? "Total Amount" : "Gesamtbetrag"}: <span className="text-white font-bold">{currentPrice.toFixed(2).replace(".", ",")} €</span></div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm"
                >
                  {language === "en" ? "Back to Shop" : "Zurück zum Shop"}
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                
                {/* Order Summary Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs sm:text-sm truncate">{order.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.details?.genre ? `${order.details.genre} • ${order.details.voice}` : t("footer.stickyTitle")}
                      </p>
                    </div>
                    <span className="text-sm font-black text-amber-400 shrink-0">
                      {basePrice.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>

                  {order.details?.express && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{t("configurator.summary.expressTitle")}</span>
                      <span className="font-semibold text-amber-400">+9,99 €</span>
                    </div>
                  )}

                  {includeCertificate && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span>📜</span>
                        <span>{t("checkout.certificateLineItem", "Offizielle Song-Urkunde mit QR-Code")}</span>
                      </span>
                      <span className="font-semibold text-amber-400">+9,99 €</span>
                    </div>
                  )}

                  {discountApplied && (
                    <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                      <span>{t("checkout.discountApplied")}</span>
                      <span>-10%</span>
                    </div>
                  )}

                  {/* Discount Code Input */}
                  <div className="pt-1.5 flex gap-2">
                    <input
                      type="text"
                      placeholder={t("checkout.discountCodeLabel")}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
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
                            ? "bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10"
                            : "bg-slate-900 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={includeCertificate}
                              onChange={(e) => setIncludeCertificate(e.target.checked)}
                              className="rounded bg-slate-800 border-slate-600 text-amber-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-white text-xs sm:text-sm">
                                  {t("checkout.certificateAddonTitle", "Offizielle Song-Urkunde (+9,99 €)")}
                                </span>
                                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded">
                                  {t("checkout.certificateAddonBadge", "Top-Geschenk")}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                {t("checkout.certificateAddonDesc", "Druckfertiges DIN A4 PDF mit persönlichem Liedtext, goldenem Siegel & abspielbarem QR-Code zum Einrahmen.")}
                              </p>
                            </div>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCertificateModal(true)}
                            className="shrink-0 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t("checkout.certificatePreviewBtn", "Vorschau")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs sm:text-sm font-bold text-white">
                    <span>{t("configurator.summary.totalPrice")} <span className="text-[10px] font-normal text-slate-400">({language === "en" ? "incl. VAT" : "inkl. MwSt."})</span></span>
                    <span className="text-lg sm:text-xl font-black text-amber-400">
                      {currentPrice.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handlePayment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t("checkout.emailLabel")}:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t("checkout.emailPlaceholder")}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-base focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t("checkout.nameLabel")}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("checkout.namePlaceholder")}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-base focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t("checkout.phoneLabel")}:
                      </label>
                      <input
                        type="tel"
                        placeholder="+49 170 1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-base focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t("checkout.detailsLabel")}:
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t("checkout.detailsPlaceholder")}
                      value={songDetailsText}
                      onChange={(e) => setSongDetailsText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-base focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        {t("checkout.paymentMethodTitle")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPaymentHelp(!showPaymentHelp)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-sm"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{showPaymentHelp ? (language === "en" ? "Hide Help" : "Hilfe schließen") : (language === "en" ? "💡 Payment Guide" : "💡 Bezahlhilfe & Anleitung")}</span>
                      </button>
                    </div>

                    {/* PayPal Radio Card: High visual prominence & hover effect */}
                    <label className={`relative block p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                      paymentMethod === "paypal"
                        ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 border-amber-400 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/60 text-white"
                        : "bg-slate-800/90 border-slate-600 hover:bg-gradient-to-r hover:from-amber-500/25 hover:via-yellow-400/20 hover:to-amber-500/20 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/25 text-white"
                    }`}>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "paypal"}
                            onChange={() => setPaymentMethod("paypal")}
                            className="text-amber-500 w-4 h-4 mt-0.5 shrink-0 focus:ring-amber-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="font-extrabold text-white text-xs sm:text-sm">
                                {t("checkout.paypalTitle", "PayPal Express & SEPA-Lastschrift")}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[10px] font-black rounded-md shadow-sm">
                                {t("checkout.paypalBadge", "Ohne PayPal-Konto möglich")}
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-100 font-medium mt-1 leading-relaxed">
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

                    {/* Stripe Radio Card */}
                    <label className={`relative block p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "stripe"
                        ? "bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/30 text-white"
                        : "bg-slate-800/80 border-slate-700 hover:border-amber-400/80 hover:bg-slate-800 hover:shadow-md text-slate-300"
                    }`}>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")}
                            className="text-amber-500 w-4 h-4 mt-0.5 shrink-0 focus:ring-amber-500"
                          />
                          <div>
                            <span className="font-extrabold text-white text-xs sm:text-sm block">
                              {t("checkout.stripeTitle", "Kreditkarte & Online-Zahlung")}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {t("checkout.stripeDesc", "Zahle bequem mit Kreditkarte, Apple Pay, Google Pay, Klarna oder SEPA.")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-1 shrink-0 max-w-[80px]">
                          <StripeBadge className="h-3.5" />
                        </div>
                      </div>
                    </label>

                    {/* Mobile Bezahlhilfe Accordion (shown only on mobile < md when showPaymentHelp is open) */}
                    {showPaymentHelp && (
                      <div className="md:hidden mt-2 p-3.5 bg-slate-950 rounded-2xl border border-amber-500/40 shadow-xl space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span>💡</span>
                            <span>{language === "en" ? "Payment Guide" : "Bezahlhilfe & Anleitung"}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPaymentHelp(false)}
                            className="text-slate-400 hover:text-white text-[11px]"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 text-[11px] text-slate-300">
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="font-bold text-amber-400">1. E-Mail & Häkchen: </span>
                            <span>E-Mail eingeben & AGB abhaken – erst dann werden die Bezahl-Buttons aktiv!</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <span className="font-bold text-amber-400">2. PayPal ohne Konto (Bankeinzug): </span>
                            <span>PayPal anklicken -&gt; „Als Gast zahlen“ oder „Mit Karte zahlen“ wählen -&gt; IBAN eingeben -&gt; Fertig!</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="font-bold text-white">3. Überweisung (Vorkasse): </span>
                            <span>Produktion startet sofort nach Zahlungseingang auf dem Bankkonto (ca. 1 Werktag).</span>
                          </div>
                        </div>
                        <a
                          href="https://wa.me/491708285513?text=Hallo%20Dirk,%20ich%20brauche%20Hilfe%20bei%20der%20Bezahlung"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Direkthilfe mit Dirk</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Legal Checkbox */}
                  <div className="pt-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] sm:text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-600 text-amber-500 mt-0.5 w-4 h-4 shrink-0 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="leading-snug">
                        {t("checkout.termsText")}
                      </span>
                    </label>
                  </div>

                  {/* PayPal Smart Buttons or Standard Submit Button */}
                  {paypalClientId && paymentMethod === "paypal" ? (
                    <div className="pt-2">
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800 via-slate-800/90 to-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-500/20 space-y-3.5">
                        
                        {/* Bright highlighted bar for PayPal, SEPA & Debitkarte */}
                        <div className="bg-slate-900/95 border border-amber-400/50 rounded-xl p-3.5 space-y-2.5 shadow-md">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <span className="text-amber-400 text-sm">✓</span>
                              <span>{language === "en" ? "Payment Methods Included:" : "Enthaltene Zahlungsarten:"}</span>
                            </span>
                            <span className="text-[10px] font-black text-slate-950 bg-emerald-400 px-2 py-0.5 rounded shadow-sm">
                              {language === "en" ? "No account needed" : "Kein PayPal-Konto nötig"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <PayPalBadge />
                            <SepaBadge />
                            <DebitCardBadge />
                          </div>

                          <p className="text-[11px] text-amber-100/90 font-medium leading-relaxed">
                            {language === "en"
                              ? "With PayPal account OR choose 'Pay with Debit or Credit Card / As Guest' below for direct SEPA bank debit."
                              : "Mit deinem PayPal-Konto ODER wähle unten einfach „Mit Debit- oder Kreditkarte zahlen“ / „Als Gast“, um bequem per Bankeinzug (SEPA) zu bezahlen."}
                          </p>
                        </div>

                        {/* Inactive notice if not checked */}
                        {(!customerEmail || !agreedTerms) && (
                          <div className="text-xs text-amber-950 font-black text-center py-3 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-amber-300 shadow-lg shadow-amber-500/25 animate-pulse">
                            {language === "en"
                              ? "👉 Please enter your email above & check the consent box to activate PayPal & SEPA!"
                              : "👉 Bitte oben E-Mail eintragen & Häkchen setzen, um PayPal, SEPA & Debitkarte freizuschalten!"}
                          </div>
                        )}

                        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                          <PayPalButtons
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                            disabled={!customerEmail || !agreedTerms || isProcessing}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    description: order.name || "Personalisierter Song",
                                    amount: {
                                      currency_code: "EUR",
                                      value: currentPrice.toFixed(2),
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
                                setTransactionId(txId);
                                await recordOrder(txId, details.payer);
                                setIsProcessing(false);
                                setIsCompleted(true);
                                trackPurchase(txId, { ...order, price: currentPrice });
                              } catch (err) {
                                console.error("PayPal Capture Error:", err);
                                alert(language === "en" ? "Error during payment capture. Please try again." : "Fehler bei der Zahlungsabwicklung. Bitte versuche es erneut.");
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
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span>{t("checkout.processing")} ⏳</span>
                      ) : (
                        <span>{language === "en" ? "Order Now with Obligation to Pay" : "Jetzt zahlungspflichtig bestellen"} ({currentPrice.toFixed(2).replace(".", ",")} €)</span>
                      )}
                    </button>
                  )}
                </form>

                {/* Trust Badges */}
                <div className="pt-3.5 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t("checkout.secureSsl")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
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

          <div className="pt-4 text-center text-[11px] text-slate-500">
            MyMusicMoment24 • {language === "en" ? "From the Heart to the Ears" : "Von Herzen für die Ohren"}
          </div>

        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "en" ? "Official Keepsake Add-on" : "Offizielles Song-Zusatzprodukt"}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {language === "en" ? "Official Song Certificate with QR Code" : "Offizielle Song-Urkunde mit Liedtext & QR-Code"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                {language === "en"
                  ? "Print-ready DIN A4 PDF with your personal lyrics, golden seal and scannable QR code to play the song anytime."
                  : "Druckfertiges DIN A4 PDF mit persönlichem Liedtext, goldenem Siegel & abspielbarem QR-Code zum Einrahmen."}
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl mb-4 bg-slate-950">
              <img
                src="/images/urkunde-beispiel.jpg"
                alt="Song-Urkunde Muster"
                className="w-full h-auto object-contain max-h-[44vh] mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 mb-5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{language === "en" ? "Print-ready DIN A4 PDF" : "Druckfertig DIN A4"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{language === "en" ? "Play & Download QR Code" : "QR-Code: Anhören & Download"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{language === "en" ? "Golden Seal" : "Goldenes Siegel"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
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
                <span>{language === "en" ? "Add to Order (+€9.99)" : "Urkunde hinzufügen (+9,99 €)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
