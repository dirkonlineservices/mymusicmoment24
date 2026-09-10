import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, Music, Sparkles } from "lucide-react";
import { trackBeginCheckout, trackPurchase } from "../lib/gtmPreview";

export default function PayPalCheckout({ isOpen, onClose, order }) {
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

  useEffect(() => {
    if (isOpen && order) {
      trackBeginCheckout(order);
      setIsCompleted(false);
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

  const currentPrice = discountApplied ? Number((order.price * 0.9).toFixed(2)) : order.price;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toLowerCase() === "gutschein" || discountCode.trim().toLowerCase() === "music10") {
      setDiscountApplied(true);
      alert("10% Rabattcode erfolgreich aktiviert!");
    } else if (discountCode.trim()) {
      alert("Ung\u00fcltiger Rabattcode.");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!customerEmail) {
      alert("Bitte gib deine E-Mail-Adresse f\u00fcr die Zustellung des Songs an.");
      return;
    }
    if (!agreedTerms) {
      alert("Bitte best\u00e4tige die Gesch\u00e4ftsbedingungen und den Beginn der sofortigen Produktion.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedTxId = `MMM-${Date.now().toString(36).toUpperCase()}`;
      setTransactionId(generatedTxId);
      setIsProcessing(false);
      setIsCompleted(true);
      trackPurchase(generatedTxId, { ...order, price: currentPrice });
    }, 1200);
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
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">Bestellung abschlie\u00dfen</h3>
                  <p className="text-[11px] text-slate-400">MyMusicMoment24 \u2022 Sofortige Produktion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Schlie\u00dfen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCompleted ? (
              <div className="my-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">Vielen Dank f\u00fcr deine Bestellung!</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Deine Song-Bestellung ist erfolgreich eingegangen. Wir beginnen sofort mit der Erstellung deines pers\u00f6nlichen Unikats!
                </p>
                <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono text-slate-300 space-y-1.5 border border-slate-800">
                  <div>Bestell-Nr: <span className="text-amber-400 font-bold">{transactionId}</span></div>
                  <div>Empf\u00e4nger: <span className="text-white">{customerEmail}</span></div>
                  <div>Zustellung via: <span className="text-emerald-400 font-bold">E-Mail {customerPhone ? `& WhatsApp (${customerPhone})` : ""}</span></div>
                  <div>Gesamtbetrag: <span className="text-white font-bold">{currentPrice.toFixed(2).replace(".", ",")} \u20ac</span></div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm"
                >
                  Zur\u00fcck zum Shop
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
                        {order.details?.genre ? `${order.details.genre} \u2022 ${order.details.voice}` : "Pers\u00f6nlicher Song"}
                      </p>
                    </div>
                    <span className="text-sm font-black text-amber-400 shrink-0">
                      19,99 \u20ac
                    </span>
                  </div>

                  {order.details?.express && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Express-Produktion (unter 12h)</span>
                      <span className="font-semibold text-amber-400">+9,99 \u20ac</span>
                    </div>
                  )}

                  {order.details?.pdfLyrics && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Songtext-Urkunde (PDF)</span>
                      <span className="font-semibold text-amber-400">+4,99 \u20ac</span>
                    </div>
                  )}

                  {discountApplied && (
                    <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                      <span>Gutschein / Rabatt (10%)</span>
                      <span>-10%</span>
                    </div>
                  )}

                  {/* Discount Code Input */}
                  <div className="pt-1.5 flex gap-2">
                    <input
                      type="text"
                      placeholder="Rabattcode eingeben"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      Anwenden
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs sm:text-sm font-bold text-white">
                    <span>Gesamtsumme <span className="text-[10px] font-normal text-slate-400">(inkl. MwSt.)</span></span>
                    <span className="text-lg sm:text-xl font-black text-amber-400">
                      {currentPrice.toFixed(2).replace(".", ",")} \u20ac
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handlePayment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deine E-Mail-Adresse:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="deine.email@beispiel.de"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-base focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Voller Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Vor- und Nachname"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-base focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp-Nummer (optional):
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
                      F\u00fcr wen ist der Song & besondere W\u00fcnsche:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Namen, Anlass, Stimmung oder Anekdoten f\u00fcr den Songtext..."
                      value={songDetailsText}
                      onChange={(e) => setSongDetailsText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-base focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Zahlungsart w\u00e4hlen
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${paymentMethod === "paypal" ? "bg-amber-500/10 border-amber-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-300"}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                          className="text-amber-500"
                        />
                        <span className="font-bold text-xs sm:text-sm">PayPal</span>
                      </div>
                      <span className="font-black italic text-sm sm:text-base text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${paymentMethod === "card" ? "bg-amber-500/10 border-amber-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-300"}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="text-amber-500"
                        />
                        <span className="font-bold text-xs sm:text-sm">Kreditkarte & SEPA</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400">Visa, Mastercard, Amex</span>
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
                        Mit dem Kauf stimme ich zu, dass die Produktion meines personalisierten Songs sofort beginnt. 
                        Ich best\u00e4tige, dass das gesetzliche Widerrufsrecht f\u00fcr digitale Inhalte nach Beginn der Ausf\u00fchrung erlischt (\u00a7 356 Abs. 5 BGB).
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Zahlung wird verarbeitet... \u23f3</span>
                    ) : (
                      <span>Jetzt zahlungspflichtig bestellen ({currentPrice.toFixed(2).replace(".", ",")} \u20ac)</span>
                    )}
                  </button>
                </form>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>256-Bit SSL-Verschl\u00fcsselung & K\u00e4uferschutz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Lieferung meist in 24 Stunden an Werktagen</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="pt-4 text-center text-[11px] text-slate-500">
            MyMusicMoment24 \u2022 Von Herzen f\u00fcr die Ohren
          </div>

        </div>
      </div>
    </div>
  );
}
