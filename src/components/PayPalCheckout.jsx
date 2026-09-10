import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, CreditCard, Music, Sparkles, AlertCircle } from "lucide-react";
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

  // Handle ESC key to dismiss drawer
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
      alert("Ung?ltiger Rabattcode.");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!customerEmail) {
      alert("Bitte gib deine E-Mail-Adresse f?r die Zustellung des Songs an.");
      return;
    }
    if (!agreedTerms) {
      alert("Bitte best?tige die Gesch?ftsbedingungen und den Beginn der sofortigen Produktion.");
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-over Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Bestellung abschlie?en</h3>
                  <p className="text-xs text-slate-400">MyMusicMoment24 ? Sofortige Produktion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Schlie?en"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCompleted ? (
              <div className="my-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white">Vielen Dank f?r deine Bestellung!</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deine Song-Bestellung ist eingegangen. Wir beginnen sofort mit der Erstellung deines pers?nlichen Unikats!
                </p>
                <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
                  <div>Bestell-Nr: <span className="text-amber-400 font-bold">{transactionId}</span></div>
                  <div>Empf?nger: <span className="text-white">{customerEmail}</span></div>
                  <div>Zustellung via: <span className="text-emerald-400 font-bold">E-Mail {customerPhone ? `& WhatsApp (${customerPhone})` : ""}</span></div>
                  <div>Gesamtbetrag: <span className="text-white font-bold">{currentPrice.toFixed(2).replace(".", ",")} ?</span></div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
                >
                  Zur?ck zum Shop
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                
                {/* Order Summary Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{order.name}</h4>
                      <p className="text-xs text-slate-400">
                        {order.details?.genre ? `${order.details.genre} ? ${order.details.voice}` : "Pers?nlicher Song"}
                      </p>
                    </div>
                    <span className="text-sm font-black text-amber-400">
                      19,99 ?
                    </span>
                  </div>

                  {order.details?.express && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Express-Produktion (12h)</span>
                      <span className="font-semibold text-amber-400">+9,99 ?</span>
                    </div>
                  )}

                  {order.details?.pdfLyrics && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Songtext Urkunde (PDF)</span>
                      <span className="font-semibold text-amber-400">+4,99 ?</span>
                    </div>
                  )}

                  {discountApplied && (
                    <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                      <span>Gutschein / Rabatt (10%)</span>
                      <span>-10%</span>
                    </div>
                  )}

                  {/* Discount Code Input */}
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Rabattcode eingeben"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
                    >
                      Anwenden
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                    <span>Gesamtsumme <span className="text-xs font-normal text-slate-400">(inkl. MwSt.)</span></span>
                    <span className="text-xl font-black text-amber-400">
                      {currentPrice.toFixed(2).replace(".", ",")} ?
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handlePayment} className="space-y-4">
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
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
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
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp-Nummer (optional f?r Audio):
                      </label>
                      <input
                        type="tel"
                        placeholder="+49 170 1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      F?r wen ist der Song & besondere Details:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Namen, Anlass, Stimmung oder besondere Anekdoten f?r den Text..."
                      value={songDetailsText}
                      onChange={(e) => setSongDetailsText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Zahlungsart w?hlen
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
                        <span className="font-bold text-sm">PayPal</span>
                      </div>
                      <span className="font-black italic text-base text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
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
                        <span className="font-bold text-sm">Kreditkarte & SEPA</span>
                      </div>
                      <span className="text-xs text-slate-400">Visa, Mastercard, Amex</span>
                    </label>
                  </div>

                  {/* Legal Checkbox ? 356 Abs. 5 BGB */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="rounded bg-slate-700 border-slate-600 text-amber-500 mt-0.5 w-4 h-4 shrink-0"
                      />
                      <span>
                        Mit dem Kauf stimme ich zu, dass die Produktion meines personalisierten Songs sofort beginnt. 
                        Ich best?tige, dass das gesetzliche Widerrufsrecht f?r digitale Inhalte nach Beginn der Ausf?hrung erlischt (? 356 Abs. 5 BGB).
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-[0.99] text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Zahlung wird verarbeitet... ?</span>
                    ) : (
                      <span>Jetzt zahlungspflichtig bestellen ({currentPrice.toFixed(2).replace(".", ",")} ?)</span>
                    )}
                  </button>
                </form>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>256-Bit SSL-Verschl?sselung & K?uferschutz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Lieferung meist in 24 Stunden (werktags)</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="pt-4 text-center text-xs text-slate-500">
            MyMusicMoment24 ? Von Herzen f?r die Ohren
          </div>

        </div>
      </div>
    </div>
  );
}
