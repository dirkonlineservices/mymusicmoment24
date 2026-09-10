import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, CreditCard, Music, Sparkles, AlertCircle } from "lucide-react";
import { trackBeginCheckout, trackPurchase } from "../lib/gtmPreview";

export default function PayPalCheckout({ isOpen, onClose, order }) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
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

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!customerEmail) {
      alert("Bitte gib deine E-Mail-Adresse für die Zustellung des Songs an.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedTxId = `TX-${Date.now().toString(36).toUpperCase()}`;
      setTransactionId(generatedTxId);
      setIsProcessing(false);
      setIsCompleted(true);
      trackPurchase(generatedTxId, order);
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PayPal Express Checkout"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-over Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Sichere Bestellung</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCompleted ? (
              <div className="my-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white">Vielen Dank für deine Bestellung!</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deine Song-Konfiguration wurde erfolgreich an unser Audio-Team übermittelt.
                </p>
                <div className="bg-slate-800/80 p-4 rounded-xl text-left text-xs font-mono text-slate-300 space-y-1">
                  <div>Transaktions-ID: <span className="text-orange-400">{transactionId}</span></div>
                  <div>Zustellung an: <span className="text-white">{customerEmail}</span></div>
                  <div>Lieferzeit: <span className="text-emerald-400">{order.details.express ? "Express (unter 12 Std.)" : "Standard (24-48 Std.)"}</span></div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
                >
                  Fenster schließen
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Order Summary Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Bestellübersicht</h4>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Personalisierter Song ({order.details.occasion})</span>
                    <span className="font-semibold text-white">49,00 €</span>
                  </div>
                  {order.details.express && (
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Express-Produktion (12h)</span>
                      <span className="font-semibold text-orange-400">+19,00 €</span>
                    </div>
                  )}
                  {order.details.pdfLyrics && (
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Songtext Urkunde (PDF)</span>
                      <span className="font-semibold text-orange-400">+9,00 €</span>
                    </div>
                  )}
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-bold text-white">
                    <span>Gesamtbetrag</span>
                    <span className="text-orange-400">{order.price},00 €</span>
                  </div>
                </div>

                {/* Delivery Form */}
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Name des Bestellers:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Vor- und Nachname"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      E-Mail-Adresse für Song-Zustellung:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="deine.email@beispiel.de"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* PayPal Brand Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#ffc439] hover:bg-[#f4b628] active:scale-[0.99] text-slate-900 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span className="inline-block animate-spin mr-2">⏳</span>
                      ) : (
                        <span className="font-black italic text-lg tracking-tight">PayPal</span>
                      )}
                      <span>{isProcessing ? "Zahlung wird autorisiert..." : `Mit PayPal zahlen (${order.price},00 €)`}</span>
                    </button>
                  </div>
                </form>

                {/* Trust badges */}
                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>256-Bit SSL-Verschlüsselung & PayPal Käuferschutz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Zufriedenheitsgarantie: 100% maßgeschneidert nach deinen Wünschen</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 text-center text-xs text-slate-500">
            MyMusicMoment24 © 2026 • Sichere Zahlungsabwicklung
          </div>

        </div>
      </div>
    </div>
  );
}
