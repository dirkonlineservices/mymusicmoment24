import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, Music, Sparkles, Lock, Eye, CheckCircle2 } from "lucide-react";
import { trackAddToCart, trackBeginCheckout, trackPurchase } from "../lib/gtmPreview";
import { PayPalBadge, StripeBadge, VisaBadge, MastercardBadge, ApplePayBadge, GooglePayBadge, SepaBadge, KlarnaBadge } from "./PaymentBadges";
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

  const isVoucher = order?.category === "gutschein" || order?.id?.includes("gutschein");
  const basePrice = isVoucher ? order.price : 19.99;
  const expressExtra = order.details?.express ? 9.99 : 0;
  const certificateExtra = includeCertificate ? 9.99 : 0;
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

      <div className="absolute inset-y-0 right-0 max-w-full flex">
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

                  {/* Urkunde Add-on Checkbox (always under discount code) */}
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
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {t("checkout.paymentMethodTitle")}
                    </label>

                    <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === "paypal" ? "bg-amber-500/10 border-amber-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600"}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                          className="text-amber-500"
                        />
                        <div>
                          <span className="font-bold text-xs sm:text-sm block">PayPal Express</span>
                          <span className="text-[10px] text-slate-400">{t("checkout.paypalDesc")}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <PayPalBadge className="h-3.5" />
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === "stripe" ? "bg-amber-500/10 border-amber-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600"}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "stripe"}
                          onChange={() => setPaymentMethod("stripe")}
                          className="text-amber-500"
                        />
                        <div>
                          <span className="font-bold text-xs sm:text-sm block">{language === "en" ? "Credit Card & Online Payment" : "Kreditkarte & Online-Zahlung"}</span>
                          <span className="text-[10px] text-slate-400">{t("checkout.stripeDesc")}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <StripeBadge className="h-3.5" />
                      </div>
                    </label>
                  </div>

                  {/* Legal Checkbox */}
                  <div className="pt-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] sm:text-xs text-slate-400">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="rounded bg-slate-700 border-slate-600 text-amber-500 mt-0.5 w-4 h-4 shrink-0"
                      />
                      <span>
                        {t("checkout.termsText")}
                      </span>
                    </label>
                  </div>

                  {/* PayPal Smart Buttons or Standard Submit Button */}
                  {paypalClientId && paymentMethod === "paypal" ? (
                    <div className="pt-2">
                      {(!customerEmail || !agreedTerms) && (
                        <p className="text-[11px] text-amber-400/90 text-center mb-2 font-medium bg-amber-500/10 py-1.5 px-3 rounded-lg border border-amber-500/20">
                          {language === "en" ? "💡 Please enter your email address and accept terms to activate PayPal." : "💡 Bitte gib deine E-Mail-Adresse ein und hake das Kästchen an, um PayPal zu aktivieren."}
                        </p>
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
                <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t("checkout.secureSsl")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t("hero.trustDelivery")}</span>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 opacity-90">
                    <PayPalBadge className="h-3" />
                    <StripeBadge className="h-3" />
                    <VisaBadge className="h-2.5" />
                    <MastercardBadge className="h-3" />
                    <ApplePayBadge className="h-3" />
                    <GooglePayBadge className="h-3" />
                    <SepaBadge className="h-3" />
                    <KlarnaBadge className="h-3" />
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
