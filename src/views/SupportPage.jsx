import React from "react";
import { ArrowLeft, MessageSquare, Mail, ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import PaymentBadges, { PayPalBadge, StripeBadge, SepaBadge, ApplePayBadge, KlarnaBadge } from "../components/PaymentBadges";

export default function SupportPage({ onBackToHome, onGoToConfigurator }) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
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
            <span>MyMusicMoment<span className="text-amber-500">24</span></span>
          </button>

          <div className="scale-90 sm:scale-100">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-14 sm:py-20 px-4 bg-gradient-to-b from-amber-50/50 via-white to-[#faf8f5] border-b border-stone-200 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === "en" ? "Customer Service & Assistance" : "Kundenservice & Support"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight mb-4">
            {language === "en" ? (
              <>We're here to help you personally</>
            ) : (
              <>Wir sind persönlich für Dich da!</>
            )}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {language === "en"
              ? "Do you have questions about your order, wish to clarify details, or need assistance with PayPal or bank transfers? Reach out to founder Dirk Schmetzer directly."
              : "Du hast Fragen zu Deiner Bestellung, möchtest besondere Details besprechen oder kommst bei der Bezahlung mit PayPal oder Stripe nicht weiter? Wir helfen Dir gerne und schnell."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-10">

        {/* 2 Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WhatsApp Card */}
          <div className="bg-white border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-stone-200/50 hover:border-emerald-500 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="inline-block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                {language === "en" ? "Fastest Response" : "Schnellste Antwortzeit"}
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">WhatsApp-Support</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {language === "en"
                  ? "Chat directly with founder Dirk Schmetzer. Perfect for quick questions, lyrics changes, or immediate payment assistance."
                  : "Schreib uns direkt eine Nachricht auf WhatsApp. Ideal für eilige Fragen zum Song, Textanpassungen oder wenn die Zahlung hakt."}
              </p>
            </div>

            <div>
              <a
                href="https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20habe%20eine%20Frage%20zu%20MyMusicMoment24"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === "en" ? "Start WhatsApp Chat" : "WhatsApp-Chat starten"}</span>
              </a>
              <span className="block text-center text-[11px] text-stone-500 mt-2">
                {language === "en" ? "Usually replies within a few minutes / hours" : "Antwort meist innerhalb weniger Minuten oder Stunden"}
              </span>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-stone-200/50 hover:border-amber-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <div className="inline-block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                {language === "en" ? "Official Contact" : "Schriftlicher Kontakt"}
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2">E-Mail Kundenservice</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {language === "en"
                  ? "Prefer writing an email? Send us your questions, order references, or custom audio wishes anytime."
                  : "Du bevorzugst E-Mail? Sende uns Deine Anfrage, Bestellnummer oder individuelle Sonderwünsche jederzeit per Mail."}
              </p>
            </div>

            <div>
              <a
                href="mailto:info@mymusicmoment24.de"
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>info@mymusicmoment24.de</span>
              </a>
              <span className="block text-center text-[11px] text-stone-500 mt-2">
                {language === "en" ? "DS Online Services • Dirk Schmetzer, Stuttgart" : "DS Online Services • Dirk Schmetzer, Stuttgart"}
              </span>
            </div>
          </div>

        </div>

        {/* Detailed Payment Guide Section */}
        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/50 space-y-6">
          <div className="border-b border-stone-200 pb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-3 inline-block">
              <HelpCircle className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
              {language === "en" ? "Payment Guide & Instructions" : "Bezahlhilfe & Zahlungsanleitung"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === "en" ? "How payment works & Alternatives" : "So funktioniert die Bezahlung – Schritt für Schritt"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === "en"
                ? "Everything you need to know about PayPal, SEPA Direct Debit, Credit Card, and Bank Transfer."
                : "Alles Wissenswerte zu PayPal, SEPA-Lastschrift, Kreditkarte und klassischer Banküberweisung."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Step 1: Form & Legal */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === "en" ? "E-Mail & Terms Agreement" : "E-Mail & AGB-Zustimmung"}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === "en"
                  ? "Why is the payment button inactive? Legally, custom-made digital songs require your email and agreement to the terms before payment is unlocked."
                  : "Warum ist der Bezahl-Button anfangs inaktiv? Bei individuell erstellten digitalen Songs verlangt der Gesetzgeber vorab die E-Mail-Angabe und das Häkchen für den sofortigen Produktionsstart."}
              </p>
            </div>

            {/* Step 2: PayPal & SEPA */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === "en" ? "PayPal & SEPA Direct Debit" : "PayPal & SEPA-Lastschrift"}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === "en"
                  ? "You don't need a PayPal account! In the PayPal window, simply choose 'Pay with Debit or Credit Card' or SEPA bank debit as a guest."
                  : "Du brauchst kein eigenes PayPal-Konto! Im PayPal-Fenster kannst Du ganz einfach als Gast per SEPA-Lastschrift vom Bankkonto oder Debitkarte zahlen."}
              </p>
            </div>

            {/* Step 3: Card, Apple Pay & Bank Transfer */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">
                {language === "en" ? "Stripe, Apple Pay or Transfer" : "Kreditkarte, Apple Pay & Überweisung"}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === "en"
                  ? "Pay seamlessly via Apple Pay, Google Pay, Visa, Mastercard, Klarna, or contact us for classic bank wire transfer."
                  : "Zahle bequem mit Apple Pay, Google Pay, Kreditkarte, Klarna oder kontaktiere uns für eine klassische Banküberweisung per IBAN."}
              </p>
            </div>

          </div>

          {/* Special Bank Transfer Notice Box */}
          <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/60 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  {language === "en" ? "Prefer paying by classic Bank Transfer (Prepayment)?" : "Möchtest Du per normaler Banküberweisung (Vorkasse) zahlen?"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                  {language === "en"
                    ? "You can choose 'Bank Transfer' directly in our checkout to immediately receive your Order ID and our bank details. Important: Production begins immediately once the payment is credited to our bank account (usually 1 business day)."
                    : "Du kannst die Banküberweisung direkt in unserem Song-Checkout auswählen und erhältst sofort deine persönliche Bestellnummer als Verwendungszweck. Wichtiger Hinweis: Bei manueller Banküberweisung beginnt die Produktion Deines Songs sofort nach Geldeingang auf unserem Bankkonto (in der Regel 1 Werktag)."}
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-3 font-mono shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between text-stone-700 font-sans gap-0.5">
                    <span className="text-stone-500">Kontoinhaber:</span>
                    <span className="font-bold text-stone-900">Dirk Schmetzer</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-stone-700 font-sans gap-0.5">
                    <span className="text-stone-500">Bank:</span>
                    <span className="font-bold text-stone-900">ING DiBa</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-stone-700 font-sans gap-0.5">
                    <span className="text-stone-500">IBAN:</span>
                    <span className="font-bold text-amber-700 font-mono tracking-wider">DE92 5001 0517 5431 9731 25</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-stone-700 font-sans gap-0.5">
                    <span className="text-stone-500">BIC:</span>
                    <span className="font-bold text-stone-900 font-mono">INGDDEFFXXX</span>
                  </div>
                  <div className="text-[11px] text-amber-900 font-sans pt-1 border-t border-stone-200">
                    💡 <strong>Wichtig:</strong> Bitte als Verwendungszweck immer Deine persönliche <strong>Bestellnummer (z.B. MMM-XXXXXX)</strong> aus dem Checkout angeben!
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://wa.me/4915906122744?text=Hallo%20Dirk,%20ich%20habe%20eine%20Frage%20zur%20Bank%C3%BCberweisung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Frage per WhatsApp stellen</span>
                  </a>
                  <a
                    href="mailto:info@mymusicmoment24.de?subject=Anfrage%20Bank%C3%BCberweisung"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition border border-stone-300"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>Per E-Mail kontaktieren</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-stone-500">Geprüfte Zahlungsdienstleister • Käuferschutz garantiert</span>
            </div>
            <button
              onClick={onGoToConfigurator}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>Song-Konfigurator starten (19,99 €)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
